import React from 'react';
import Column from './Column';

function Board() {
  return (
    <div className="board">
      <h1>보드 이름</h1>
      <p>보드 한 줄 설명</p>
      <div className="columns">
        <Column title="To Do" cards={[{text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.", user: "OOO 님"}, {text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.", user: "OOO 님"}]} />
        <Column title="In Progress" cards={[{text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.", user: "OOO 님"}, {text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.", user: "OOO 님"}]} />
        <Column title="Done" cards={[{text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.", user: "OOO 님"}, {text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.", user: "OOO 님"}]} />
      </div>
    </div>
  );
}

export default Board;
