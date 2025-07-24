import React, { useState } from 'react';
import Homepage from './components/Homepage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import DemoPage from './components/DemoPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  const handleAuth = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={setCurrentPage} />;
      case 'auth':
        return <AuthPage onAuth={handleAuth} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'demo':
        return <DemoPage onNavigate={setCurrentPage} />;
      default:
        return <Homepage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {renderPage()}
    </div>
  );
}

export default App;