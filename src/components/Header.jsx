import React from 'react';
import styles from '../styles/Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>Trello</div>
      <div className={styles.headerButtons}>
        <button>로그인</button>
        <button>회원가입</button>
      </div>
    </header>
  );
}

export default Header;
