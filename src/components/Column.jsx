import React from 'react';
import Card from './Card';

function Column({ title, cards }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      {cards.map((card, index) => (
        <Card key={index} text={card.text} user={card.user} />
      ))}
    </div>
  );
}

export default Column;
