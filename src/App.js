import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
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
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
