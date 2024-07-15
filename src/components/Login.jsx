import React from 'react';
import { useRef, useEffect } from 'react' 
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

function Login() {
    const emailInput = useRef();
    const passwordInput = useRef();

    const navigate = useNavigate();

    const handleBoardClick = async (e) => {
        e.preventDefault();

        if (!emailInput.current || !passwordInput.current) {
            alert('빈 칸을 전부 입력 해주세요.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/auth/login`, {
                email: emailInput.current.value,
                password: passwordInput.current.value,
            });

            // Access 토큰을 localStorage에 저장
            localStorage.setItem('accessToken', response.data.result.access);

            navigate('/board');
        } catch (error) {
            alert(`${error.response.data.msg}`);
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.login}>
        <h2 className={styles.title}>로그인</h2>
        <form className={styles.form}>
            <input className={styles.input} type="email" placeholder="Email" ref={emailInput} />
            <input className={styles.input} type="password" placeholder="Password" ref={passwordInput} />
            <button className={styles.button} type="submit" onClick={handleBoardClick}>Login</button>
            <button className={styles.button} type="submit" onClick={handleSignupClick}>Sign up</button>
        </form>
    </div>
    );
}

export default Login;