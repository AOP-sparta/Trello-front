import React, { useState } from 'react';
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import Card from './Card';
import styles from '../styles/Column.module.css';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

function Column({ title, cards, onDeleteColumn }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };
  
  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleSaveModal = (newTitle) => {
    setColumnTitle(newTitle);
    setIsEditing(false);
    alert(`컬럼 수정: ${newTitle}`);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(false);
    onDeleteColumn(columnTitle); 
    alert(`컬럼 삭제: ${columnTitle}`);
  };

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <h2>{columnTitle}</h2>
        <div className={styles.columnIcons}>
          <MdEdit className={styles.editIcon} onClick={handleEditClick} />
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
      {cards.map((card, index) => (
        <Card key={index} text={card.text} user={card.user} />
      ))}
    </div>
  );
}

export default Column;
