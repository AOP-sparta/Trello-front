import React, { useState } from 'react';
import styles from '../../styles/Modal.module.css';

function EditModal({ title, initialValue, onSave, onClose }) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <input type="text" value={value} onChange={handleChange} />
        <div className={styles.modalButtons}>
          <button onClick={handleSave}>수정</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
