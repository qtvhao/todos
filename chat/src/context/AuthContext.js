// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { connectWebSocket } from '../services/webSocketService';
import { WS_URL } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = Cookies.get('token');
    return token ? { token } : null;
  });

  const login = (accessKeyId, secretAccessKey) => {
    const token = `${accessKeyId}:${secretAccessKey}`; // Mock token, replace with real token generation
    Cookies.set('token', token);
    setAuth({ token });
    connectWebSocket(WS_URL, token);
  };

  const logout = () => {
    Cookies.remove('token');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);