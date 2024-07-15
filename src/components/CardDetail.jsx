import React, { useState } from 'react';
import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/CardDetail.module.css';
import { SlArrowUpCircle } from "react-icons/sl";
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import Comment from '../components/Comment';
import CardEditModal from './CardEditModal';
import DeleteModal from './DeleteModal';
import axios from 'axios';

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
    const [isDeleting, setIsDeleting] = useState(false);

    const [titleValue, setTitle] = useState(title);
    const [contentValue, setContent] = useState(content);
    const [managerValue, setManager] = useState(manager);
    const [deadlineValue, setDeadline] = useState(deadline);
    const [comments, setComments] = useState([]);

    const commentInput = useRef();

    // Axios 인스턴스 생성
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080', // API 기본 URL 설정
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        }
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        setIsDeleting(true);
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

    const handleConfirmDelete = () => {
        setIsDeleting(false);
        // 카드 삭제 api

        navigate('/board');
    };

    const handleSendClick = async () => {
        const commentContent = commentInput.current.value;

        if (!commentContent) {
            alert("댓글 내용을 입력하세요.");
            return;
        }

        try {
            await axiosInstance.post(`/cards/${id}/comments`, {
                id,
                content: commentContent,
            });

            fetchComments(id);
            commentInput.current.value = ""; // 입력 필드 초기화
        } catch (error) {
            console.error("댓글 작성 중 오류:", error);
            alert("댓글 작성에 실패했습니다.");
        }
    };

    const handleBoardClick = () => {
        navigate('/board');
    };

    const fetchComments = async (id) => {
        try {
            const response = await axiosInstance.get(`/cards/${id}/comments`); 
            setComments(response.data);
        } catch (error) {
            console.error("댓글 가져오기 중 오류:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchComments(id);
        }
    }, [id]);

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
                        <div className={styles.icons}>
                            <MdEdit className={styles.editIcon} onClick={handleEditClick} />
                            <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} />
                        </div>
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
                            title={titleValue}
                            content={contentValue}
                            manager={managerValue}
                            deadline={deadline}
                            onSave={handleSaveModal}
                            onClose={handleCloseModal}
                        />
                    )}
                    {isDeleting && (
                        <DeleteModal
                            title={`"${titleValue}" 삭제`}
                            content="정말로 삭제하시겠습니까?"
                            onClose={handleCloseModal}
                            onConfirm={handleConfirmDelete}
                            confirmText="삭제"
                        />
                    )}
                </div>
                <div className={styles.commentsSection}>
                    <h3>댓글</h3>
                    {comments.map(comment => (
                        <Comment key={comment.id} text={comment.content} user={comment.user} />
                    ))}
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
