import React, { useState, useEffect } from 'react';
import { MdAddCircleOutline, MdEdit } from 'react-icons/md';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import Column from './Column';
import ColumnModal from './ColumnModal';
import AddBoardModal from './BoardModal/AddBoardModal';
import EditBoardModal from './BoardModal/EditBoardModal';
import DeleteBoardModal from './BoardModal/DeleteBoardModal';
import InviteUserModal from './BoardModal/InviteUserModal';
import styles from '../styles/Board.module.css';

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
          acc[board.id] = board; // id를 키로 사용하여 boards 객체 생성
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
        const response = await axios.get(`http://localhost:8080/boards/${selectedBoard}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatuses(response.data.result);
        console.log(statuses)
        //console.log(response.data.result); // 상태가 잘 설정되었는지 확인
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    fetchStatuses();
  }, [selectedBoard]);

  const handleBoardChange = (event) => {
    setSelectedBoard(event.target.value);
  };

  const handleDeleteColumn = (columnId) => {
    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      updatedBoards[selectedBoard].columns = updatedBoards[selectedBoard].columns.filter(
          (column) => column.id !== columnId
      );
      return updatedBoards;
    });
  };

  const handleAddCard = (columnId, newCard) => {
    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      const column = updatedBoards[selectedBoard].columns.find((column) => column.id === columnId);
      if (column) {
        column.cards.push(newCard);
      }
      return updatedBoards;
    });
  };

  const handleAddColumn = (title) => {
    if (!selectedBoard) {
      alert('Please select a board first.');
      return;
    }

    const newColumn = { id: new Date().getTime(), title: title, cards: [] };

    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      updatedBoards[selectedBoard].columns.push(newColumn);
      return updatedBoards;
    });

    setIsColumnModalOpen(false);
  };

  const handleAddBoard = (boardName, boardDescription) => {
    const newBoardKey = boardName.trim();
    const newBoard = {
      columns: [],
      description: boardDescription,
    };

    setBoards((prevBoards) => ({
      ...prevBoards,
      [newBoardKey]: newBoard,
    }));

    setSelectedBoard(newBoardKey);
    setIsBoardModalOpen(false);
  };

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

  const handleSubmitEditBoard = () => {
    if (!editBoardKey || !editBoardName || !editBoardDescription) {
      alert('Please fill in all fields.');
      return;
    }

    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      const updatedBoard = {
        columns: updatedBoards[selectedBoard]?.columns || [],
        description: editBoardDescription,
      };
      delete updatedBoards[selectedBoard];
      updatedBoards[editBoardName] = updatedBoard;
      return updatedBoards;
    });

    setSelectedBoard(editBoardName);
    setIsEditModalOpen(false);
  };

  const handleDeleteBoard = () => {
    if (!selectedBoard) {
      alert('Please select a board first.');
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBoard = () => {
    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      delete updatedBoards[selectedBoard];
      return updatedBoards;
    });

    setSelectedBoard('');
    setIsDeleteModalOpen(false);
  };

  const handleInviteUser = () => {
    setIsInviteModalOpen(true);
  };

  const sendInvitation = (email) => {
    console.log(`Inviting user with email: ${email}`);
    setIsInviteModalOpen(false);
  };

  const handleMoveCard = (cardId, fromColumnId, toColumnId) => {
    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      const fromColumn = updatedBoards[selectedBoard].columns.find(column => column.id === fromColumnId);
      const toColumn = updatedBoards[selectedBoard].columns.find(column => column.id === toColumnId);

      if (fromColumn && toColumn) {
        const cardIndex = fromColumn.cards.findIndex(card => card.id === cardId);
        const [movedCard] = fromColumn.cards.splice(cardIndex, 1);
        toColumn.cards.push(movedCard);
      }

      return updatedBoards;
    });
  };

  const selectedColumns = boards[selectedBoard]?.columns || [];

  const chunkColumns = (columns, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < columns.length; i += chunkSize) {
      chunkedArray.push(columns.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const chunkedColumns = chunkColumns(statuses, 3);

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
            {Object.entries(boards).map(([boardKey, boardData]) => (
                <option key={boardKey} value={boardKey}>{boardData.boardName}</option> // boardName으로 수정
            ))}
          </select>
          <div className={styles.addColumnButton} onClick={() => setIsColumnModalOpen(true)}>
            <MdAddCircleOutline className={styles.addColumnIcon} size={24}/>
            <span className={styles.addColumnText}>Add Column</span>
          </div>
        </div>
        <div>
          {chunkedColumns.map((chunk, index) => (
              <div key={index} className={styles.columns}>
                {chunk.map((status) => (
                    <Column
                        key={status.statusId}
                        id={status.statusId}
                        title={status.title}
                        cards={status.cards || []} // cards가 undefined일 경우 빈 배열로 초기화
                        onDeleteColumn={handleDeleteColumn}
                        onAddCard={handleAddCard}
                        onMoveCard={handleMoveCard}
                    />
                ))}
              </div>
          ))}
        </div>
        <ColumnModal
            isOpen={isColumnModalOpen}
            onClose={() => setIsColumnModalOpen(false)}
            onAddColumn={handleAddColumn}
        />
        <AddBoardModal
            isOpen={isBoardModalOpen}
            onClose={() => setIsBoardModalOpen(false)}
            onAddBoard={handleAddBoard}
        />
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
        <InviteUserModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onInvite={sendInvitation}
        />
      </div>
  );
}

export default Board;