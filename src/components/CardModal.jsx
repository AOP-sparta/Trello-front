import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';
import axios from 'axios';

function CardModal({ onClose, onSave, boardId, id}) {
  const [title, setTitle] = useState(''); // 카드 제목 상태
  const [content, setContent] = useState('');

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  const handleSave = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      alert('Access token is missing. Please log in.');
      return;
    }

    console.log('Access Token:', accessToken);

    try {
      await axios.post(
          `http://localhost:8080/boards/${boardId}/status/${id}/cards`, // API 엔드포인트 URL
          { title : title, content : content },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            } // 수정된 부분: title과 content로 전달
          }
      );

      // 카드 생성 성공 시, onSave를 통해 상태 업데이트
      onSave({ title, content }); // 수정된 부분: title과 content를 전달
      onClose(); // 모달 닫기
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
