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
    console.log('Access Token:', accessToken);
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
        const newBoardKey = newBoard.boardName.trim();
        setBoards((prevBoards) => ({
          ...prevBoards,
          [newBoardKey]: {
            id: newBoard.id,
            columns: [],
            description: newBoard.introduction,
          },
        }));
        setSelectedBoard(newBoardKey);
        setIsBoardModalOpen(false);
        console.log('보드 생성 응답 데이터:', response.data); // 응답 데이터만 출력
      } else {
        alert('보드 생성 실패');
      }
    } catch (error) {
      console.error('보드 생성 오류:', error);
      if (error.response && error.response.status === 403) {
        console.log('Full error response:', error.response);
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
    console.log('Access Token:', accessToken);
    console.log('PUT URL:', url);
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
        console.log('Full error response:', error.response);
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
        console.log('보드 삭제 응답 데이터:', response.data); // 응답 데이터 출력
        alert('보드 삭제 성공');
      } else {
        alert('보드 삭제 실패');
      }
    } catch (error) {
      console.error('보드 삭제 오류:', error);
      if (error.response && error.response.status === 403) {
        console.log('Full error response:', error.response);
        alert('권한이 없습니다.');
      } else {
        alert('보드 삭제 중 오류가 발생했습니다.');
      }
    }
  };
  // 사용자 초대
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
          {Object.entries(boards).map(([boardKey, boardData]) => (
            <option key={boardKey} value={boardKey}>{boardData.boardName}</option> // boardName으로 수정
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