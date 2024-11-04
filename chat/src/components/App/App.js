// src/components/App/App.js
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { MessageProvider } from '../../context/MessageContext';
import Login from '../Login/Login';
import RightPanel from '../RightPanel/RightPanel';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from '../SignUp/SignUp';
import WebSocketProvider from './WebSocketProvider';

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
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <WebSocketProvider>
                <div className="app">
                  <LeftSidebar />
                  <RightPanel />
                </div>
              </WebSocketProvider>
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
