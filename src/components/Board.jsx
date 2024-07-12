import React, { useState } from 'react';
import Column from './Column';
import styles from '../styles/Board.module.css';

function Board() {
  const [selectedBoard, setSelectedBoard] = useState('');

  const handleBoardChange = (event) => {
    setSelectedBoard(event.target.value);
  };

  const boards = {
    '보드 1': {
      columns: [
        { title: '🗒️ To Do', cards: [{ text: 'Task 1', user: 'OOO 님' }, { text: 'Task 2', user: 'OOO 님' }] },
        { title: '💻 In Progress', cards: [{ text: 'Task 3', user: 'OOO 님' }, { text: 'Task 4', user: 'OOO 님' }] },
        { title: '🚀 Done', cards: [{ text: 'Task 5', user: 'OOO 님' }, { text: 'Task 6', user: 'OOO 님' }] },
      ],
    },
    '보드 2': {
      columns: [
        { title: '🗒️ To Do', cards: [{ text: 'Task A', user: 'OOO 님' }, { text: 'Task B', user: 'OOO 님' }] },
        { title: '💻 In Progress', cards: [{ text: 'Task C', user: 'OOO 님' }, { text: 'Task D', user: 'OOO 님' }] },
        { title: '🚀 Done', cards: [{ text: 'Task E', user: 'OOO 님' }, { text: 'Task F', user: 'OOO 님' }] },
      ],
    },
  };

  const selectedColumns = boards[selectedBoard]?.columns || [];

  return (
    <div className={styles.board}>
      <h1>{selectedBoard || '보드 이름'}</h1>
      <p>보드 한 줄 설명</p>
      <div className={styles.selectBoard}>
        <select id="board-select" value={selectedBoard} onChange={handleBoardChange}>
          <option value="" disabled>보드 선택</option>
          <option value="보드 1">보드 1</option>
          <option value="보드 2">보드 2</option>
        </select>
      </div>
      <div className={styles.columns}>
        {selectedColumns.map((column, index) => (
          <Column key={index} title={column.title} cards={column.cards} />
        ))}
      </div>
    </div>
  );
}

export default Board;
