import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAddCircleOutline, MdEdit } from 'react-icons/md';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import Column from './Column';
import ColumnModal from './ColumnModal';
import AddBoardModal from './BoardModal/AddBoardModal';
import EditBoardModal from './BoardModal/EditBoardModal';
import DeleteBoardModal from './BoardModal/DeleteBoardModal';
import InviteUserModal from './BoardModal/InviteUserModal';
import styles from '../styles/Board.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Board() {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [boards, setBoards] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBoardKey, setEditBoardKey] = useState('');
  const [editBoardName, setEditBoardName] = useState('');
  const [editBoardDescription, setEditBoardDescription] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/boards', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // response.data.result의 구조가 [ { id, boardName, introduction }, ... ]인지 확인하세요.
        console.log(response.data.result); // 로그 추가
        const boardsData = response.data.result.reduce((acc, board) => {
          acc[board.boardName.trim()] = {
            id: board.id,
            columns: [],
            description: board.introduction,
          };
          return acc;
        }, {});
        setBoards(boardsData);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      if (!selectedBoard) return;

      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatuses(response.data.result);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    fetchStatuses();
  }, [selectedBoard]);

  const handleBoardChange = (event) => {
    setSelectedBoard(event.target.value);
  };

  const handleDeleteColumn = async (columnId) => {
    if (!selectedBoard) {
      alert('보드를 먼저 선택해주세요');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8080/boards/${boards[selectedBoard].id}/status/${columnId}`, {
        headers: { Authorization: `Bearer ${token}` },
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

        return updatedBoards;
      });
      // 상태 업데이트 후, 상태를 최신으로 다시 가져오기
      const fetchStatuses = async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatuses(response.data.result);
      };

      console.log()
      fetchStatuses();
    } catch (error) {
      console.error('컬럼 삭제 실패:', error);
    }
  };

  const handleAddCard = (columnId, newCard) => {
    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      const columnIndex = updatedBoards[selectedBoard].columns.findIndex((column) => column.id === columnId);
      if (columnIndex !== -1) {
        updatedBoards[selectedBoard].columns[columnIndex].cards.push(newCard);
      }
      return updatedBoards;
    });
  };

  const handleAddColumn = async (title) => {
    if (!selectedBoard) {
      alert('Please select a board first.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, { title }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newColumn = response.data.result;

      setBoards((prevBoards) => {
        const updatedBoards = { ...prevBoards };

        if (!updatedBoards[selectedBoard].columns) {
          updatedBoards[selectedBoard].columns = [];
        }

        updatedBoards[selectedBoard].columns.push(newColumn);
        return updatedBoards;
      });

      // 상태 업데이트 후, 상태를 최신으로 다시 가져오기
      const fetchStatuses = async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8080/boards/${boards[selectedBoard].id}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatuses(response.data.result);
      };

      fetchStatuses();
      setIsColumnModalOpen(false);
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  // 보드 추가
  const handleAddBoard = async (boardName, boardDescription) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      alert('Access token is missing. Please log in.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/boards', {
        boardName: boardName,
        introduction: boardDescription,
      }, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        const newBoard = response.data.result;

        setBoards((prevBoards) => ({
          ...prevBoards,
          [newBoard.boardName.trim()]: {
            id: newBoard.id,
            columns: [],
            description: newBoard.introduction,
          },
        }));

        setSelectedBoard(newBoard.boardName.trim());
        setIsBoardModalOpen(false);
        console.log('보드 생성 응답 데이터:', response.data);
      } else {
        alert('보드 생성 실패');
      }
    } catch (error) {
      console.error('보드 생성 오류:', error);
      if (error.response && error.response.status === 403) {
        alert('권한이 없습니다.');
      } else {
        alert('보드 생성 중 오류가 발생했습니다.');
      }
    }
  };

  // 보드 수정
  const handleEditBoard = () => {
    if (!selectedBoard) {
      alert('Please select a board first.');
      return;
    }

    setEditBoardKey(selectedBoard);
    setEditBoardName(selectedBoard);
    setEditBoardDescription(boards[selectedBoard]?.description || '');

    setIsEditModalOpen(true);
  };

  const handleSubmitEditBoard = async () => {
    if (!editBoardKey || !editBoardName || !editBoardDescription) {
      alert('Please fill in all fields.');
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      alert('Access token is missing. Please log in.');
      return;
    }

    const boardId = boards[selectedBoard].id;
    const url = `http://localhost:8080/boards/${boardId}`;

    try {
      const response = await axios.put(url, {
        boardName: editBoardName,
        introduction: editBoardDescription,
      }, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setBoards((prevBoards) => {
          const updatedBoards = { ...prevBoards };
          const updatedBoard = {
            id: boardId,
            columns: updatedBoards[selectedBoard]?.columns || [],
            description: editBoardDescription,
          };
          delete updatedBoards[selectedBoard];
          updatedBoards[editBoardName] = updatedBoard;
          return updatedBoards;
        });

        setSelectedBoard(editBoardName);
        setIsEditModalOpen(false);
        console.log('보드 수정 응답 데이터:', response.data);
      } else {
        alert('보드 수정 실패');
      }
    } catch (error) {
      console.error('보드 수정 오류:', error);
      if (error.response) {
        if (error.response.status === 401) {
          alert('인증 오류: 유효하지 않은 토큰입니다. 다시 로그인하세요.');
        } else if (error.response.status === 400) {
          alert('잘못된 요청입니다.');
        } else {
          alert('보드 수정 중 오류가 발생했습니다.');
        }
      } else {
        alert('서버와 통신하는 중 오류가 발생했습니다.');
      }
    }
  };

  // 보드 삭제
  const handleDeleteBoard = () => {
    if (!selectedBoard) {
      alert('Please select a board first.');
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBoard = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      alert('Access token is missing. Please log in.');
      return;
    }

    const selectedBoardData = boards[selectedBoard];
    if (!selectedBoardData || !selectedBoardData.id) {
      alert('Selected board does not have a valid ID.');
      return;
    }

    const boardId = selectedBoardData.id;
    const url = `http://localhost:8080/boards/${boardId}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        const updatedBoards = { ...boards };
        delete updatedBoards[selectedBoard];
        setBoards(updatedBoards);
        setSelectedBoard('');
        setIsDeleteModalOpen(false);
        console.log('보드 삭제 응답 데이터:', response.data);
        alert('보드 삭제 성공');
      } else {
        alert('보드 삭제 실패');
      }
    } catch (error) {
      console.error('보드 삭제 오류:', error);
      if (error.response && error.response.status === 403) {
        alert('권한이 없습니다.');
      } else {
        alert('보드 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 보드 초대
  const handleInviteUser = () => {
    setIsInviteModalOpen(true);
  };

  const sendInvitation = async (email) => {
    console.log(`Inviting user with email: ${email}`);
  
    if (!selectedBoard || !boards[selectedBoard]) {
      alert('Please select a board first.');
      return;
    }
  
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8080/boards/${boards[selectedBoard].id}/invite`, {
        email: email,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 201) {
        console.log('보드 초대 성공:', response.data);
        alert('사용자 초대 성공');
      } else {
        alert('사용자 초대 실패');
      }
    } catch (error) {
      console.error('사용자 초대 오류:', error);
      if (error.response) {
        if (error.response.status === 401) {
          alert('인증 오류: 유효하지 않은 토큰입니다. 다시 로그인하세요.');
        } else if (error.response.status === 403) {
          alert('권한이 없습니다. 보드 관리자만 초대할 수 있습니다.');
        } else if (error.response.status === 404) {
          alert('보드를 찾을 수 없습니다. 다시 시도하세요.');
        } else if (error.response.status === 400) {
          alert('잘못된 요청입니다.');
        } else {
          alert('사용자 초대 중 오류가 발생했습니다.');
        }
      } else {
        alert('서버와 통신 중 오류가 발생했습니다.');
      }
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
      console.error('Error updating column order:', error);
    }
  };

  return (
      <div className={styles.board}>
      <span className={styles.boardIcons}>
        <span className={styles.boardText}>Board</span>
        <MdAddCircleOutline onClick={() => setIsBoardModalOpen(true)} className={styles.boardIcon} size={25}/>
        <MdEdit onClick={handleEditBoard} className={styles.boardIcon} size={25}/>
        <FaTrashAlt onClick={handleDeleteBoard} className={styles.boardIcon} size={23}/>
        <FaUserPlus onClick={handleInviteUser} className={styles.boardIcon} size={24}/>
      </span>
      <div className={styles.boardHeader}>
        <h1>{selectedBoard || '보드 이름'}</h1>
        <p>{boards[selectedBoard]?.description || '보드 한 줄 설명'}</p>
      </div>
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
      <AddBoardModal isOpen={isBoardModalOpen} onClose={() => setIsBoardModalOpen(false)} onAddBoard={handleAddBoard} />
      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        boardName={editBoardName}
        boardDescription={editBoardDescription}
        onSubmit={handleSubmitEditBoard}
        onNameChange={setEditBoardName}
        onDescriptionChange={setEditBoardDescription}
      />
      <DeleteBoardModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDeleteBoard}
      />
      <InviteUserModal isOpen={isInviteModalOpen}
      onClose={() => setIsInviteModalOpen(false)}
      onInvite={sendInvitation} />
    </div>
  );
}

export default Board;
