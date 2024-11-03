// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { connectWebSocket } from '../services/webSocketService';
import { WS_URL, USERS_API } from '../constants';

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

  const signUp = async (username) => {
    const response = await fetch(USERS_API + 'users/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: username,
        name: username,
        email: `${username}@example.com`,
        attributes: {
          department: 'engineering',
          role: 'developer',
        },
      }),
    });

    if (response.ok) {
      let responseJson = await response.json();
      let status = responseJson.status;
      if (status === 'success') {
        console.log('Signed up successfully');
        return { username };
      } else {
        console.error('Failed to sign up');
        return false;
      }
    } else {
      console.error('Failed to sign up');
      return false;
    }
  }

  const logout = () => {
    Cookies.remove('token');
    setAuth(null);
  };

  const createAccessKeys = async (username) => {
    const response = await fetch(USERS_API + 'users/access-keys/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: username,
        description: 'My new access key',
      }),
    });

    if (response.ok) {
      let responseJson = await response.json();
      let status = responseJson.status;
      let access_key = responseJson.access_key;
      let access_key_id = access_key.access_key_id;
      let secret_access_key = access_key.secret_access_key;
      if (status === 'success') {
        console.log('Access keys created successfully');
        console.log('Access Key ID:', access_key_id);
        console.log('Secret Access Key:', secret_access_key);

        return { access_key_id, secret_access_key };
      } else {
        console.error('Failed to create access keys');
        return false;
      }
    } else {
      console.error('Failed to create access keys');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, createAccessKeys, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);