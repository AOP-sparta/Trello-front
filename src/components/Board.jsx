import React, { useState } from 'react';
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

function Board() {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [boards, setBoards] = useState({
    '보드 1': {
      columns: [
        { id: 1, title: '🗒️ To Do', cards: [{ id: 1, text: 'Task 1', user: 'OOO 님' }, { id: 2, text: 'Task 2', user: 'OOO 님' }] },
        { id: 2, title: '💻 In Progress', cards: [{ id: 3, text: 'Task 3', user: 'OOO 님' }, { id: 4, text: 'Task 4', user: 'OOO 님' }] },
        { id: 3, title: '🚀 Done', cards: [{ id: 5, text: 'Task 5', user: 'OOO 님' }, { id: 6, text: 'Task 6', user: 'OOO 님' }] },
      ],
    },
    '보드 2': {
      columns: [
        { id: 4, title: '🗒️ To Do', cards: [{ id: 7, text: 'Task A', user: 'OOO 님' }, { id: 8, text: 'Task B', user: 'OOO 님' }] },
        { id: 5, title: '💻 In Progress', cards: [{ id: 9, text: 'Task C', user: 'OOO 님' }, { id: 10, text: 'Task D', user: 'OOO 님' }] },
        { id: 6, title: '🚀 Done', cards: [{ id: 11, text: 'Task E', user: 'OOO 님' }, { id: 12, text: 'Task F', user: 'OOO 님' }] },
      ],
    },
  });

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBoardKey, setEditBoardKey] = useState('');
  const [editBoardName, setEditBoardName] = useState('');
  const [editBoardDescription, setEditBoardDescription] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); 

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
      const columnIndex = updatedBoards[selectedBoard].columns.findIndex((column) => column.id === columnId);
      if (columnIndex !== -1) {
        updatedBoards[selectedBoard].columns[columnIndex].cards.push(newCard);
      }
      return updatedBoards;
    });
  };

  const handleAddColumn = (title) => {
    if (!selectedBoard) {
      alert('보드를 먼저 선택해주세요.');
      return;
    }

    const newColumnId = new Date().getTime();
    const newColumn = { id: newColumnId, title: title, cards: [] };

    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      updatedBoards[selectedBoard].columns.push(newColumn);
      return updatedBoards;
    });

    setIsColumnModalOpen(false);
  };

  // 보드 추가
  const handleAddBoard = async (boardName, boardDescription) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:8080/boards',
        {
          board_name: boardName,
          introduction: boardDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        const newBoard = response.data.result;
        const newBoardKey = newBoard.board_name.trim();

        setBoards((prevBoards) => ({
          ...prevBoards,
          [newBoardKey]: {
            columns: [],
            description: newBoard.introduction,
          },
        }));

        setSelectedBoard(newBoardKey);
        setIsBoardModalOpen(false);
      } else {
        alert('보드 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('보드 생성 에러:', error);
      alert('보드 생성에 실패했습니다.');
    }
  };

  // 보드 수정
  const handleEditBoard = () => {
    if (!selectedBoard) {
      alert('보드를 먼저 선택해주세요.');
      return;
    }

    setEditBoardKey(selectedBoard);
    setEditBoardName(selectedBoard);
    setEditBoardDescription(boards[selectedBoard]?.description || '');

    setIsEditModalOpen(true);
  };

  const handleSubmitEditBoard = async () => {
    if (!editBoardKey || !editBoardName || !editBoardDescription) {
      alert('모든 항목을 입력하세요.');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `http://localhost:8080/boards/${editBoardKey}`,
        {
          board_name: editBoardName,
          introduction: editBoardDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedBoard = response.data.result;
        setBoards((prevBoards) => {
          const updatedBoards = { ...prevBoards };
          delete updatedBoards[editBoardKey];
          updatedBoards[updatedBoard.board_name] = {
            columns: updatedBoards[editBoardKey]?.columns || [],
            description: updatedBoard.introduction,
          };
          return updatedBoards;
        });

        setSelectedBoard(updatedBoard.board_name);
        setIsEditModalOpen(false);
      } else {
        alert('보드 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('보드 수정 에러:', error);
      alert('보드 수정에 실패했습니다.');
    }
  };

  // 보드 삭제
  const handleDeleteBoard = () => {
    if (!selectedBoard) {
      alert('보드를 먼저 선택해주세요.');
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
    // 여기에 실제로 초대 메일을 보내는 로직 추가
    console.log(`Inviting user with email: ${email}`);
    setIsInviteModalOpen(false);
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

  const selectedColumns = boards[selectedBoard]?.columns || [];

  const chunkColumns = (columns, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < columns.length; i += chunkSize) {
      chunkedArray.push(columns.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const chunkedColumns = chunkColumns(selectedColumns, 3);

  return (
    <div className={styles.board}>
      <span className={styles.boardIcons}>
        <span className={styles.boardText}>Board</span>
        <MdAddCircleOutline onClick={() => setIsBoardModalOpen(true)} className={styles.boardIcon} size={25} />
        <MdEdit onClick={handleEditBoard} className={styles.boardIcon} size={25} />
        <FaTrashAlt onClick={handleDeleteBoard} className={styles.boardIcon} size={23} />
        <FaUserPlus onClick={handleInviteUser} className={styles.boardIcon} size={24} />
      </span>
      <div className={styles.boardHeader}>
        <h1>{selectedBoard || '보드 이름'}</h1>
        <p>{boards[selectedBoard]?.description || '보드 한 줄 설명'}</p>
      </div>
      <div className={styles.selectBoard}>
        <select id="board-select" value={selectedBoard} onChange={handleBoardChange}>
          <option value="" disabled>보드 선택</option>
          {Object.keys(boards).map((boardKey) => (
            <option key={boardKey} value={boardKey}>{boardKey}</option>
          ))}
        </select>
        <div className={styles.addColumnButton} onClick={() => setIsColumnModalOpen(true)}>
          <MdAddCircleOutline className={styles.addColumnIcon} size={24} />
          <span className={styles.addColumnText}>Add Column</span>
        </div>
      </div>
      <div>
        {chunkedColumns.map((chunk, index) => (
          <div key={index} className={styles.columns}>
            {chunk.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                cards={column.cards}
                onDeleteColumn={handleDeleteColumn}
                onAddCard={handleAddCard}
                onMoveCard={handleMoveCard}
              />
            ))}
          </div>
        ))}
      </div>
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
