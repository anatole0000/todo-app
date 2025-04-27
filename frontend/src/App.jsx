// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TodoApp from './TodoApp';
import Header from './Header';
import Footer from './Footer';
import SettingsPage from './SettingsPage'; // Example Settings Page
import ProfilePage from './ProfilePage'; // Example Profile Page
import JokeGenerator from './JokeGenerator';

const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="/todos" element={<TodoApp />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/joke" element={<JokeGenerator />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
