import React from 'react';
import styles from '../../styles/Board.module.css';

function DeleteBoardModal({ isOpen, onClose, onDelete }) {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
      <div className={styles.modal}>
        <h2>보드 삭제</h2>
        <p>삭제하는 경우 연결된 데이터가 전부 삭제됩니다. 정말 삭제하시겠습니까?</p>
        <div className={styles.modalButtons}>
          <button className={styles.deleteButton} onClick={handleDelete}>삭제</button>
          <button className={styles.cancelButton} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBoardModal;
