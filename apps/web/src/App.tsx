import { useState } from 'react';
import Homepage from './components/Homepage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import DemoPage from './components/DemoPage';
import ProgressiveDifficultyDemo from './components/ProgressiveDifficultyDemo';
import { TRPCProvider } from './components/TRPCProvider';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  const handleAuth = (userData: User) => {
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
        return <Dashboard user={user ?? {}} onNavigate={setCurrentPage} />;
      case 'demo':
        return <DemoPage onNavigate={setCurrentPage} />;
      case 'progressive-demo':
        return <ProgressiveDifficultyDemo onNavigate={setCurrentPage} />;
      default:
        return <Homepage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <TRPCProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
        {renderPage()}
      </div>
    </TRPCProvider>
  );
}

export default App;