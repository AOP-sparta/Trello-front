import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/carddetail" element={<CardDetailPage />} />
        </Routes>
      </Router>
    </div>
  );
}

function Home() {
  return (
    <header className="App-header">
      <h1>Main Page</h1>
      <nav>
        <a href="/board">보드 페이지로 이동</a>
      </nav>
    </header>
  );
}

export default App;
