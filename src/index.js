import React from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';
import Header from './components/Header';
import BoardPage from './pages/BoardPage';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <BoardPage />
  </React.StrictMode>,
  document.getElementById('root')
);