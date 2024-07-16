import React, {useEffect, useState} from 'react';
import styles from '../../styles/Modal.module.css';
import axios from 'axios';

function CardModal({ onClose, onSave, boardId, id}) {
  const [title, setTitle] = useState(''); // 카드 제목 상태
  const [content, setContent] = useState('');

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
          `http://localhost:8080/boards/${boardId}/status/${id}/cards`,
          { title : title, content : content },
          {
            headers: {
              Authorization: getAccessToken()
            }
          }
      );
      const savedCard = response.data.result;
      onSave(savedCard);
      onClose();
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>카드 추가</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="cardText">제목</label>
          <input
            id="cardTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="cardUser">내용</label>
          <input
            id="cardContent"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
