import React from 'react';

function Card({ text, user }) {
  return (
    <div className="card">
      <p>{text}</p>
      <span>{user}</span>
    </div>
  );
}

export default Card;
