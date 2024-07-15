import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import axios from "axios"

function Header() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('accessToken') !== null;
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogoutClick = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/auth/logout`, {}, {
        headers: {
          Authorization: localStorage.getItem('accessToken')
        }
      });

      localStorage.setItem('accessToken', null);
      setIsLoggedIn(false);

    } catch (error) {
      alert(`${error.response.data.msg}`);
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/board" className={styles.headerTitle}>Trello</Link>
      <div className={styles.headerButtons}>
        {isLoggedIn ? (
          <button onClick={handleLogoutClick}>로그아웃</button>
        ) : (
          <>
            <button onClick={handleLoginClick}>로그인</button>
            <button onClick={handleSignupClick}>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
