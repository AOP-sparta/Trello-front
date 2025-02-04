import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';

function CardEditModal({ title, content, manager, deadline, onSave, onClose }) {
  const [titleValue, setTitle] = useState(title);
  const [contentValue, setContent] = useState(content);
  const [managerValue, setManager] = useState(manager);
  const [deadlineValue, setDeadline] = useState(deadline);

  const handleSave = () => {
    onSave({ title: titleValue, content: contentValue, manager: managerValue, deadline: deadlineValue });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>카드 수정</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="cardTitle">카드 제목</label>
          <input
            id="cardTitle"
            type="text"
            value={titleValue}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="cardContent">카드 내용</label>
          <input
            id="cardContent"
            type="text"
            value={contentValue}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="cardManager">작업자</label>
          <input
            id="cardManager"
            type="text"
            value={managerValue}
            onChange={(e) => setManager(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="cardDeadLine">마감일</label>
          <input
            id="cardDeadLine"
            type="date"
            value={deadlineValue}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className={styles.modalButtons}>
          <button onClick={handleSave}>수정</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default CardEditModal;
