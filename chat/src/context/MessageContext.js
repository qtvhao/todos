// src/context/MessageContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchMessages } from '../api/api';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      // const data = await fetchMessages();
      // setMessages(data);
    };
    // loadMessages();
  }, []);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};
