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

    const location = useLocation();
    const { id, boardId } = location.state || {}; // 카드 id 및 boardId 가져오기
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [boardTitle, setBoardTitle] = useState([]);
    const [boardIntro, setBoardIntro] = useState([]);
    const [title, setTitle] = useState([]);
    const [content, setContent] = useState([]);
    const [manager, setManager] = useState([]);
    const [deadline, setDeadline] = useState([]);
    const [status, setStatus] = useState([]);
    const [comments, setComments] = useState([]);
    const [cardDetails, setCardDetails] = useState({});

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
        setIsDeleting(false);
    };

    const handleSaveModal = async ({ title, content, manager, deadline }) => {

        if (!title || !content || !manager || !deadline) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        try {
            await axiosInstance.patch(`/boards/${boardId}/cards/${id}`, {
                title,
                content,
                nickname: manager,
                deadline,
            });

            setTitle(title);
            setContent(content);
            setManager(manager);
            setDeadline(deadline);
            alert(`카드 수정 완료: ${title}`);
        } catch (error) {
            console.error("카드 수정 중 오류:", error);
            alert("카드 수정에 실패했습니다.");
        } finally {
            setIsEditing(false);
        }
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(false);
        try {
            await axiosInstance.delete(`/boards/${boardId}/cards/${id}`);
            alert('카드가 삭제되었습니다.');
            navigate('/board'); // 삭제 후 보드로 돌아가기
        } catch (error) {
            console.error("카드 삭제 중 오류:", error);
            alert("카드 삭제에 실패했습니다.");
        }
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

    const fetchCardDetails = async (cardId, boardId) => {
        try {
            const response = await axiosInstance.get(`/boards/${boardId}/cards/${cardId}`);
            const { title, statusTitle, content, nickname, deadline, boardTitle, boardIntro } = response.data.result;

            setBoardTitle(boardTitle);
            setBoardIntro(boardIntro);
            setTitle(title);
            setStatus(statusTitle);
            setContent(content);
            setManager(nickname);
            setDeadline(deadline);
            setCardDetails(response.data.result);
        } catch (error) {
            console.error("카드 정보 가져오기 중 오류:", error);
        }
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
            fetchCardDetails(id, boardId);
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
                        <span className={styles.cardTitle}>{title}</span>
                        <div className={styles.icons}>
                            <MdEdit className={styles.editIcon} onClick={handleEditClick} />
                            <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} />
                        </div>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.cardInfo}>
                            <p><strong>작업자</strong> {manager}</p>
                            <p><strong>상태</strong> {status}</p>
                            <p><strong>마감 일자</strong> {deadline}</p>
                            <p><strong>내용</strong> {content}</p>
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
                    {isDeleting && (
                        <DeleteModal
                            title={`"${title}" 삭제`}
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
