import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import styles from '../styles/Card.module.css';

function Card({ text, user, id, columnId }) {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    const boardTitle = "임시보드제목";
    const boardExplain = "임시보드설명";
    
    navigate('/card', { state: { boardTitle, boardExplain } });
  };
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={styles.card} style={{ opacity: isDragging ? 0.5 : 1 }} onClick={handleCardClick}>
      <p>{text}</p>
      <span>{user}</span>
    </div>
  );
}

export default Card;
