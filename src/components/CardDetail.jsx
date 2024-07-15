import React, { useState } from 'react';
import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/CardDetail.module.css';
import { SlArrowUpCircle } from "react-icons/sl";
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import Comment from '../components/Comment';
import CardEditModal from './CardEditModal';

function CardDetail() {
    const navigate = useNavigate();

    // 창 켤 때 카드 id로 조회 합니다.
    const boardTitle = "임시 보드 타이틀";
    const boardIntro = "임시 보드 설명";

    const title = "임시 타이틀";
    const status = "임시 상태";
    const content = "임시 콘텐츠";
    const deadline = "임시 데드라인";
    const manager = "임시 담당자";

    const location = useLocation();
    const { id } = location.state || {}; // 카드 id임
    const [isEditing, setIsEditing] = useState(false);
    const [titleValue, setTitle] = useState(title);
    const [contentValue, setContent] = useState(content);
    const [managerValue, setManager] = useState(manager);
    const [deadlineValue, setDeadline] = useState(deadline);

    const commentInput = useRef();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setIsEditing(false);
    };

    const handleSaveModal = ({ titleValue, contentValue, managerValue, deadlineValue }) => {
        setTitle(titleValue);
        setContent(contentValue);
        setManager(managerValue);
        setDeadline(deadlineValue);
        setIsEditing(false);
        alert(`카드 수정: ${titleValue}`);
    };

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
                <p>{boardIntro}</p>
            </div>
            <main className={styles.mainContent}>
                <div className={styles.cardDetail}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{titleValue}</span>
                        <MdEdit className={styles.editIcon} onClick={handleEditClick} />
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.cardInfo}>
                            <p><strong>작업자</strong> {managerValue}</p>
                            <p><strong>상태</strong> {status}</p>
                            <p><strong>마감 일자</strong> {deadlineValue}</p>
                            <p><strong>내용</strong> {contentValue}</p>
                        </div>
                        <button className={styles.backButton} onClick={handleBoardClick}>보드로 돌아가기</button>
                    </div>
                    {isEditing && (
                        <CardEditModal
                            title={title}
                            content={content}
                            manager={manager}
                            deadline={deadline}
                            onSave={handleSaveModal}
                            onClose={handleCloseModal}
                        />
                    )}
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
