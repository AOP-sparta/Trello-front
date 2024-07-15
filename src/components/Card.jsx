import React from 'react';
import { useDrag } from 'react-dnd';
import styles from '../styles/Card.module.css';

function Card({ text, user, id, columnId }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={styles.card} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <p>{text}</p>
      <span>{user}</span>
    </div>
  );
}

export default Card;
