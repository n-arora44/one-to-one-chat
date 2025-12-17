import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components will be created next
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <AuthGuard>
              <Chat />
            </AuthGuard>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
