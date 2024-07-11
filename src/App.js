import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
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
        <a href="/main">Go to Main Page</a>
      </nav>
    </header>
  );
}

export default App;
