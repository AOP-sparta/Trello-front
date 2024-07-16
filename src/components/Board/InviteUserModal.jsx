import React, { useState } from 'react';
import styles from '../../styles/Board.module.css';

function InviteUserModal({ isOpen, onClose, onInvite }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onInvite(email);
    setEmail('');
    onClose(); // 모달 닫기
  };

  return (
    <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
      <div className={styles.modal}>
        <h2>사용자 초대</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">초대</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default InviteUserModal;
