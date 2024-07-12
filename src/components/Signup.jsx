import React from 'react';
import styles from '../styles/Signup.module.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();

    const handleBoardClick = () => {
        navigate('/board');
    };

    return (
        <div className={styles.signup}>
            <h2 className={styles.title}>회원가입</h2>
            <form className={styles.form}>
                <input className={styles.input} type="email" placeholder="Email" />
                <input className={styles.input} type="password" placeholder="Password" />
                <input className={styles.input} type="password" placeholder="Repeat Password" />
                <input className={styles.input} type="text" placeholder="User Name" />
                <button className={styles.button} type="submit" onClick={handleBoardClick}>Sign up</button>
            </form>
        </div>
    );
}

export default Signup;