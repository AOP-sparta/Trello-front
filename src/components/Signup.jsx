import React from 'react';
import { useRef, } from 'react' 
import styles from '../styles/Signup.module.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

function Signup() {
    const emailInput = useRef();
    const passwordInput = useRef();
    const nicknameInput = useRef();

    const navigate = useNavigate();

    const handleSignupClick = () => {
        axios.post(`http://localhost:8080/users/signup`, {
            email: emailInput.current.value,
            password: passwordInput.current.value,
            nickname: nicknameInput.current.value
        })
            .then(rsp => {
                if (rsp.data.msg == "회원가입 성공") {
                    console.log(rsp.data.result);
                    navigate('/board');
                }
            });
    };

    return (
        <div className={styles.signup}>
            <h2 className={styles.title}>회원가입</h2>
            <div className={styles.form}>
                <input className={styles.input} type="email" placeholder="Email" ref={emailInput} />
                <input className={styles.input} type="password" placeholder="Password" ref={passwordInput} />
                <input className={styles.input} type="password" placeholder="Repeat Password" />
                <input className={styles.input} type="text" placeholder="User Name" ref={nicknameInput} />
                <button className={styles.button} type="submit" onClick={handleSignupClick}>Sign up</button>
            </div>
        </div>
    );
}

export default Signup;