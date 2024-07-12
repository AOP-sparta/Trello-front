import React from 'react';
import styles from '../styles/Card.module.css';

function Card({ text, user }) {
  return (
    <div className={styles.card}>
      <p>{text}</p>
      <span>{user}</span>
    </div>
  );
}

export default Card;
