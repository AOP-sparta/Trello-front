import React, { useState } from 'react';
import styles from '../styles/BoardModal.module.css';

function AddBoardModal({ isOpen, onClose, onAddBoard }) {
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (boardName && boardDescription) {
      onAddBoard(boardName, boardDescription);
      setBoardName('');
      setBoardDescription('');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
      <div className={styles.modal}>
        <h2>새 보드 추가</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="보드 이름"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
          />
          <input
            type="text"
            placeholder="한 줄 소개"
            value={boardDescription}
            onChange={(e) => setBoardDescription(e.target.value)}
          />
          <button type="submit">추가</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default AddBoardModal;
