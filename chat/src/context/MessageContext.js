// src/context/MessageContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { fetchMessages } from '../api/api';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);

  useEffect(() => {
    if (auth) {
      doFetchMessages();
    }
  }, [auth]);

  const changeThread = (threadId) => {
    setActiveThreadId(threadId);
  };
  const doFetchMessages = async () => {
    fetchMessages().then((data) => {
      setMessages(data);
      // Set initial active thread to the first thread found in messages
      if (data.length > 0) setActiveThreadId(data[0].threadId);
    });
  };

  return (
    <MessageContext.Provider
      value={{ messages: messages, setMessages, activeThreadId, changeThread, doFetchMessages }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
