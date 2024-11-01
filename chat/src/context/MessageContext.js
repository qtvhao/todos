// src/context/MessageContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchMessages } from '../api/api';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [threads, setThreads] = useState({}); // Structure: { [threadId]: messages }
  const [activeThread, setActiveThread] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await fetchMessages();
      
      // Group messages by thread
      const groupedThreads = data.reduce((acc, message) => {
        const { threadId } = message;
        if (!acc[threadId]) {
          acc[threadId] = [];
        }
        acc[threadId].push(message);
        return acc;
      }, {});

      setThreads(groupedThreads);
      
      // Set default active thread if not already set
      if (!activeThread && Object.keys(groupedThreads).length > 0) {
        setActiveThread(Object.keys(groupedThreads)[0]);
      }
    };

    loadMessages();
  }, [activeThread]);

  const addMessageToThread = (threadId, message) => {
    setThreads((prevThreads) => ({
      ...prevThreads,
      [threadId]: [...(prevThreads[threadId] || []), message],
    }));
  };

  return (
    <MessageContext.Provider
      value={{ threads, activeThread, setActiveThread, addMessageToThread }}
    >
      {children}
    </MessageContext.Provider>
  );
};
