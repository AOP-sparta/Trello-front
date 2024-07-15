import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Card.module.css';

function Card({ text, user }) {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    const boardTitle = "임시보드제목";
    const boardExplain = "임시보드설명";
    
    navigate('/card', { state: { boardTitle, boardExplain } });
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <p>{text}</p>
      <span>{user}</span>
    </div>
  );
}

export default Card;
