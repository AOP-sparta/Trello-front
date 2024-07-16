import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAddCircleOutline } from 'react-icons/md';
import Column from '../Column/Column';
import ColumnModal from '../Column/ColumnModal';
import styles from '../../styles/Board.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Board({onSelectBoard, onSetBoards}) {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [boards, setBoards] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/boards', {
          headers: { Authorization: getAccessToken() },
        });
        const boardsData = response.data.result.reduce((acc, board) => {
          acc[board.boardName.trim()] = {
            id: board.id,
            columns: [],
            description: board.introduction,
          };
          return acc;
        }, {});
        setBoards(boardsData);
        onSetBoards(boardsData);
      } catch (error) {
        if(error.response !== null)
          console.log(error.response);
        // alert(`${error.response.data.msg}`);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      if (!selectedBoard) return;

      try {
        const response = await axios.get(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, {
          headers: { Authorization: getAccessToken() },
        });
        setStatuses(response.data.result);
      } catch (error) {
        alert(`${error.response.data.msg}`);
      }
    };

    fetchStatuses();
  }, [selectedBoard]);

  const handleBoardChange = (event) => {
    setSelectedBoard(event.target.value);
    onSelectBoard(event.target.value);
  };

  const handleDeleteColumn = async (columnId) => {
    if (!selectedBoard) {
      alert('보드를 먼저 선택해주세요');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/boards/${boards[selectedBoard].id}/status/${columnId}`, {
        headers: { Authorization: getAccessToken() },
      });

      // 성공적으로 삭제된 후 로컬 상태 업데이트
      setBoards((prevBoards) => {
        const updatedBoards = { ...prevBoards };

        // selectedBoard가 유효하고 columns가 존재하는지 확인
        if (updatedBoards[selectedBoard] && updatedBoards[selectedBoard].columns) {
          updatedBoards[selectedBoard].columns = updatedBoards[selectedBoard].columns.filter(
            (column) => column.id !== columnId
          );
        }
        onSetBoards(updatedBoards);
        return updatedBoards;
      });
      
      
      // 상태 업데이트 후, 상태를 최신으로 다시 가져오기
      const fetchStatuses = async () => {
        const response = await axios.get(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, {
          headers: { Authorization: getAccessToken() },
        });
        setStatuses(response.data.result);
      };

      fetchStatuses();
    } catch (error) {
      alert(`${error.response.data.msg}`);
    }
  };

  const handleAddCard = (columnId, newCard) => {
    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      const columnIndex = updatedBoards[selectedBoard].columns.findIndex((column) => column.id === columnId);
      if (columnIndex !== -1) {
        updatedBoards[selectedBoard].columns[columnIndex].cards.push(newCard);
      }

      onSetBoards(updatedBoards);
      return updatedBoards;
    });
  };

  const handleAddColumn = async (title) => {
    if (!selectedBoard) {
      alert('Please select a board first.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, { title }, {
        headers: { Authorization: getAccessToken() },
      });

      const newColumn = response.data.result;

      setBoards((prevBoards) => {
        const updatedBoards = { ...prevBoards };

        if (!updatedBoards[selectedBoard].columns) {
          updatedBoards[selectedBoard].columns = [];
        }

        updatedBoards[selectedBoard].columns.push(newColumn);

        onSetBoards(updatedBoards);
        return updatedBoards;
      });

      // 상태 업데이트 후, 상태를 최신으로 다시 가져오기
      const fetchStatuses = async () => {
        const response = await axios.get(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, {
          headers: { Authorization: getAccessToken() },
        });
        setStatuses(response.data.result);
      };

      fetchStatuses();
      setIsColumnModalOpen(false);
    } catch (error) {
      alert(`${error.response.data.msg}`);
    }
  };

  const handleMoveCard = (cardId, fromColumnId, toColumnId) => {
    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      const fromColumnIndex = updatedBoards[selectedBoard].columns.findIndex((column) => column.id === fromColumnId);
      const toColumnIndex = updatedBoards[selectedBoard].columns.findIndex((column) => column.id === toColumnId);

      if (fromColumnIndex !== -1 && toColumnIndex !== -1) {
        const cardIndex = updatedBoards[selectedBoard].columns[fromColumnIndex].cards.findIndex((card) => card.id === cardId);
        const [movedCard] = updatedBoards[selectedBoard].columns[fromColumnIndex].cards.splice(cardIndex, 1);
        updatedBoards[selectedBoard].columns[toColumnIndex].cards.push(movedCard);
      }

      onSetBoards(updatedBoards);
      return updatedBoards;
    });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const reorderedStatuses = Array.from(statuses);
    const [removed] = reorderedStatuses.splice(source.index, 1);
    reorderedStatuses.splice(destination.index, 0, removed);

    setStatuses(reorderedStatuses);

    try {
      const token = localStorage.getItem('accessToken');
      const currentStatusSequence = reorderedStatuses.map((status, index) => ({
        statusId: status.statusId,
        sequence: index,
      }));
      await axios.put(
        `http://localhost:8080/boards/${boards[selectedBoard].id}/status/orders`,
        currentStatusSequence,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      alert(`${error.response.data.msg}`);
    }
  };

  return (
    <>
      <div className={styles.selectBoard}>
        <select id="board-select" value={selectedBoard} onChange={handleBoardChange}>
          <option value="" disabled>보드 선택</option>
          {Object.keys(boards).map((boardKey) => (
            <option key={boards[boardKey].id} value={boardKey}>{boardKey}</option>
          ))}
        </select>
        <div className={styles.addColumnButton} onClick={() => setIsColumnModalOpen(true)}>
          <MdAddCircleOutline className={styles.addColumnIcon} size={24} />
          <span className={styles.addColumnText}>Add Column</span>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" direction="horizontal">
          {(provided) => (
            <div
              className={styles.columns}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {statuses.map((status, index) => (
                <Draggable key={status.statusId} draggableId={status.statusId.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.column}
                    >
                      <Column
                        id={status.statusId}
                        title={status.title}
                        cards={status.cards || []}
                        onDeleteColumn={handleDeleteColumn}
                        onAddCard={handleAddCard}
                        onMoveCard={handleMoveCard}
                        boardId={boards[selectedBoard].id}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <ColumnModal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} onAddColumn={handleAddColumn} />
    </>
  );
}

export default Board;
