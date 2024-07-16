import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CardDetailPage from './pages/CardDetailPage';
import Header from './components/Header';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>
        <Link to="/board">보드 페이지로 이동</Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/card" element={<CardDetailPage />} />
          </Routes>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;
