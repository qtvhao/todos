// src/components/App/App.js
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { MessageProvider } from '../../context/MessageContext';
import Login from '../Login/Login';
import RightPanel from '../RightPanel/RightPanel';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <div className="app">
                <LeftSidebar />
                <RightPanel />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
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
