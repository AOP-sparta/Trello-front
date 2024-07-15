import React from 'react';
import styles from '../../styles/Board.module.css';

function EditBoardModal({ isOpen, onClose, boardName, boardDescription, onSubmit, onNameChange, onDescriptionChange }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
      <div className={styles.modal}>
        <h2>보드 수정</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="보드 이름"
            value={boardName}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <input
            type="text"
            placeholder="한 줄 소개"
            value={boardDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
          <button type="submit">수정</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default EditBoardModal;
