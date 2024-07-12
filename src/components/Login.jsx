import React from 'react';
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleBoardClick = () => {
        navigate('/board');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.login}>
        <h2 className={styles.title}>로그인</h2>
        <form className={styles.form}>
            <input className={styles.input} type="email" placeholder="Email" />
            <input className={styles.input} type="password" placeholder="Password" />
            <button className={styles.button} type="submit" onClick={handleBoardClick}>Login</button>
            <button className={styles.button} type="submit" onClick={handleSignupClick}>Sign up</button>
        </form>
    </div>
    );
}

export default Login;