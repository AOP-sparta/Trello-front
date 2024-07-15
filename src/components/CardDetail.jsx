import React from 'react';
import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/CardDetail.module.css';
import { SlArrowUpCircle } from "react-icons/sl";
import Comment from '../components/Comment';

function CardDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { boardTitle, boardExplain } = location.state || {};

    const commentInput = useRef();

    const handleSendClick = () => {
        // 댓글 작성 api


    };

    const handleBoardClick = () => {
        navigate('/board');
    };

    return (
        <div className={styles.container}>
            <div className={styles.boardHeader}>
                <h1>{boardTitle}</h1>
                <p>{boardExplain}</p>
            </div>
            <main className={styles.mainContent}>
                <div className={styles.cardDetail}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Amet minim mollit non deserunt ullamco est sit amet sint.</span>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.cardInfo}>
                            <p><strong>작업자</strong> 000</p>
                            <p><strong>상태</strong> In Progress</p>
                            <p><strong>마감 일자</strong> 2024.07.10</p>
                            <p><strong>내용</strong> 내용입니다.</p>
                        </div>
                        <button className={styles.backButton} onClick={handleBoardClick}>보드로 돌아가기</button>
                    </div>
                </div>
                <div className={styles.commentsSection}>
                    <h3>댓글</h3>
                    <Comment text={"api 연동 후 가져온 댓글 리스트로 생성 해야 함"} />
                    <Comment text={"댓글2"} />
                    <Comment text={"댓글3"} />
                    <div className={styles.commentInputContainer}>
                        <input
                            className={styles.commentInput}
                            placeholder="댓글 작성"
                            ref={commentInput}
                        />
                        <SlArrowUpCircle className={styles.sendIcon} onClick={handleSendClick} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CardDetail;
