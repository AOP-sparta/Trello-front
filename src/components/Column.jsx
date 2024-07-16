// Column.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useDrop } from 'react-dnd';
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import Card from './Card';
import styles from '../styles/Column.module.css';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import CardModal from './CardModal';
import board from "./Board";

function Column({id, title, cards =[], onDeleteColumn, onAddCard, onMoveCard, boardId}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [columnTitle, setColumnTitle] = useState(title);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardList, setCardList] = useState(cards);

    const getAccessToken = () => {
        return localStorage.getItem('accessToken');
    };

    const [{isOver}, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item) => {
            if (item.columnId !== id) {
                onMoveCard(item.id, item.columnId, id);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));


    const handleEditClick = () => {
        setIsEditing(true);
    };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleAddCardClick = () => {
    setIsAddingCard(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setIsDeleting(false);
    setIsAddingCard(false);
  };

  const handleSaveModal = (newTitle) => {
    setColumnTitle(newTitle);
    setIsEditing(false);
    alert(`컬럼 수정: ${newTitle}`);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(false);
    onDeleteColumn(id);
    alert(`컬럼 삭제: ${columnTitle}`);
  };

    const handleSaveCard = async (newCard) => {
        onAddCard(id, {text: newCard.text, user: newCard.user});
        setCardList([...cardList, newCard]);
        setIsAddingCard(false);
    };

    const fetchCards = async () => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            alert('Access token is missing. Please log in.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/boards/${boardId}/cards?status=${title}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            setCardList(response.data.result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log("??");
        fetchCards();
    }, []);

    return (
        <div ref={drop} className={styles.column} style={{backgroundColor: isOver ? '#e0e0e0' : '#fff'}}>
            <div>
                <div className={styles.columnHeader}>
                    <h2>{columnTitle}</h2>
                    <div className={styles.columnIcons}>
                        <MdEdit className={styles.editIcon} onClick={handleEditClick}/>
                        <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick}/>
                    </div>
                </div>
                {isEditing && (
                    <EditModal
                        title="컬럼 수정"
                        initialValue={columnTitle}
                        onSave={handleSaveModal}
                        onClose={handleCloseModal}
                    />
                )}
                {isDeleting && (
                    <DeleteModal
                        title={`"${columnTitle}" 삭제`}
                        content="정말로 삭제하시겠습니까?"
                        onClose={handleCloseModal}
                        onConfirm={handleConfirmDelete}
                        confirmText="삭제"
                    />
                )}
                {isAddingCard && (
                    <CardModal
                        onClose={handleCloseModal}
                        onSave={handleSaveCard}
                        boardId={boardId}
                        id={id}
                    />
                )}
                {cardList.map((card, index) => (
                    <Card key={index} id={card.id} columnId={id} text={card.title} user={card.nickname}/>
                ))}
            </div>
            <div className={styles.addCardIcon} onClick={handleAddCardClick}>
                <MdAddCircleOutline size={24}/>
                <div>Add card</div>
            </div>
        </div>
    );
}

export default Column;
