// src/components/Login/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(accessKeyId, secretAccessKey);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Access Key ID"
          value={accessKeyId}
          onChange={(e) => setAccessKeyId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Secret Access Key"
          value={secretAccessKey}
          onChange={(e) => setSecretAccessKey(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
