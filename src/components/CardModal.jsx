import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function CardModal({ onClose, onSave }) {
  const [text, setText] = useState('');
  const [user, setUser] = useState('');

  const handleSave = () => {
    onSave({ text, user });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>카드 추가</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="cardText">내용</label>
          <input
            id="cardText"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="cardUser">사용자</label>
          <input
            id="cardUser"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className={styles.modalButtons}>
          <button onClick={handleSave}>추가</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
