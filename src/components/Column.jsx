import React, { useState } from 'react';
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import Card from './Card';
import styles from '../styles/Column.module.css';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import CardModal from './CardModal'; // 추가: CardModal import

function Column({ id, title, cards, onDeleteColumn, onAddCard }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);
  const [isAddingCard, setIsAddingCard] = useState(false); // 수정: 초기값 false로 설정

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

  const handleSaveCard = (newCard) => {
    onAddCard(id, newCard);
    setIsAddingCard(false);
  };

  return (
    <div className={styles.column}>
      <div>
        <div className={styles.columnHeader}>
          <h2>{columnTitle}</h2>
          <div className={styles.columnIcons}>
            <MdEdit className={styles.editIcon} onClick={handleEditClick} />
            <FaTrashAlt className={styles.deleteIcon} onClick={handleDeleteClick} />
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
          />
        )}
        {cards.map((card, index) => (
          <Card key={index} text={card.text} user={card.user} />
        ))}
      </div>
      <div className={styles.addCardIcon} onClick={handleAddCardClick}>
        <MdAddCircleOutline size={24} />
        <div>Add card</div>
      </div>
    </div>
  );
}

export default Column;
