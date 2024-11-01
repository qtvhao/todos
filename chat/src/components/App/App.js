// src/components/App/App.js
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { MessageProvider } from '../../context/MessageContext';
import Login from '../Login/Login';
import RightPanel from '../RightPanel/RightPanel';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import './App.css';

const AppContent = () => {
  const { auth } = useAuth();

  if (!auth) {
    return <Login />; // Show Login if not authenticated
  }

  return (
    <div className="app">
      <LeftSidebar />
      <RightPanel />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <MessageProvider>
      <AppContent />
    </MessageProvider>
  </AuthProvider>
);

export default App;
