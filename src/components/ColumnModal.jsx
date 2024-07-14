import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Board.module.css';

function ColumnModal({ isOpen, onClose, onAddColumn }) {
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleTitleChange = (event) => {
    setNewColumnTitle(event.target.value);
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === '') {
      alert('Column title cannot be empty');
      return;
    }
    onAddColumn(newColumnTitle); // 이 부분에서 입력한 컬럼의 제목을 전달하여 추가
    setNewColumnTitle(''); // 입력 필드 초기화
  };

  return (
    <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
      <div className={styles.modal}>
        <h2>컬럼 추가</h2>
        <input
          type="text"
          placeholder="추가할 컬럼의 상태를 입력해주세요."
          value={newColumnTitle}
          onChange={handleTitleChange}
        />
        <button onClick={handleAddColumn}>추가</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
}

ColumnModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddColumn: PropTypes.func.isRequired,
};

export default ColumnModal;
