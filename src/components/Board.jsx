import React, { useState } from 'react';
import { MdAddCircleOutline, MdEdit } from 'react-icons/md';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import Column from './Column';
import ColumnModal from './ColumnModal';
import styles from '../styles/Board.module.css';

function Board() {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [boards, setBoards] = useState({
    '보드 1': {
      columns: [
        { id: 1, title: '🗒️ To Do', cards: [{ text: 'Task 1', user: 'OOO 님' }, { text: 'Task 2', user: 'OOO 님' }] },
        { id: 2, title: '💻 In Progress', cards: [{ text: 'Task 3', user: 'OOO 님' }, { text: 'Task 4', user: 'OOO 님' }] },
        { id: 3, title: '🚀 Done', cards: [{ text: 'Task 5', user: 'OOO 님' }, { text: 'Task 6', user: 'OOO 님' }] },
      ],
    },
    '보드 2': {
      columns: [
        { id: 4, title: '🗒️ To Do', cards: [{ text: 'Task A', user: 'OOO 님' }, { text: 'Task B', user: 'OOO 님' }] },
        { id: 5, title: '💻 In Progress', cards: [{ text: 'Task C', user: 'OOO 님' }, { text: 'Task D', user: 'OOO 님' }] },
        { id: 6, title: '🚀 Done', cards: [{ text: 'Task E', user: 'OOO 님' }, { text: 'Task F', user: 'OOO 님' }] },
      ],
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      alert('Please select a board first.');
      return;
    }

    const newColumnId = new Date().getTime();
    const newColumn = { id: newColumnId, title: title, cards: [] }; // 입력한 컬럼의 제목 사용

    setBoards((prevBoards) => {
      const updatedBoards = { ...prevBoards };
      updatedBoards[selectedBoard].columns.push(newColumn);
      return updatedBoards;
    });

    setIsModalOpen(false); // 모달 닫기
  };

  const handleAddBoard = () => {
    alert('보드 추가 기능을 구현하세요');
  };

  const handleEditBoard = () => {
    // 보드 수정 기능을 구현하세요
    alert('보드 수정 기능을 구현하세요');
  };

  const handleDeleteBoard = () => {
    // 보드 삭제 기능을 구현하세요
    alert('보드 삭제 기능을 구현하세요');
  };

  const handleInviteUser = () => {
    // 사용자 초대 기능을 구현하세요
    alert('사용자 초대 기능을 구현하세요');
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
          <MdAddCircleOutline onClick={handleAddBoard} className={styles.boardIcon} size={25} />
          <MdEdit onClick={handleEditBoard} className={styles.boardIcon} size={25} />
          <FaTrashAlt onClick={handleDeleteBoard} className={styles.boardIcon} size={23} />
          <FaUserPlus onClick={handleInviteUser} className={styles.boardIcon} size={24} />
      </span>
      <div className={styles.boardHeader}>
        <h1>{selectedBoard || '보드 이름'}</h1>
      </div>
      <p>보드 한 줄 설명</p>
      <div className={styles.selectBoard}>
        <select id="board-select" value={selectedBoard} onChange={handleBoardChange}>
          <option value="" disabled>보드 선택</option>
          <option value="보드 1">보드 1</option>
          <option value="보드 2">보드 2</option>
        </select>
        <div className={styles.addColumnButton} onClick={() => setIsModalOpen(true)}>
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
              />
            ))}
          </div>
        ))}
      </div>
      <ColumnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddColumn={handleAddColumn} />
    </div>
  );
}

export default Board;
