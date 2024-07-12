import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <header className={styles.header}>
      <Link to="/board" className={styles.headerTitle}>Trello</Link>
      <div className={styles.headerButtons}>
        <button onClick={handleLoginClick}>로그인</button>
        <button onClick={handleSignupClick}>회원가입</button>
      </div>
    </header>
  );
}

export default Header;
