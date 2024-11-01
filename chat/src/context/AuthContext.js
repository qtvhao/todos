import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessKeyId = Cookies.get('accessKeyId');
    const secretAccessKey = Cookies.get('secretAccessKey');
    if (accessKeyId && secretAccessKey) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (accessKeyId, secretAccessKey) => {
    Cookies.set('accessKeyId', accessKeyId);
    Cookies.set('secretAccessKey', secretAccessKey);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('accessKeyId');
    Cookies.remove('secretAccessKey');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};