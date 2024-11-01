// src/components/App/App.js
import { MessageProvider } from '../../context/MessageContext';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import RightPanel from '../RightPanel/RightPanel';
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from '../../context/AuthContext';
import Login from '../Login/Login';
import './App.css';

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <MessageProvider>
      <div className="app-container">
        <LeftSidebar />
        <RightPanel />
      </div>
    </MessageProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;