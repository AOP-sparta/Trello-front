import React from 'react';
import { useRef, useEffect } from 'react' 
import styles from '../styles/CardDetail.module.css';

function Comment({ text }) {
    return (
        <div className={styles.comment}>{text}</div>
    );
}

export default Comment;
