// src/context/MessageContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { fetchMessages, addAssistantMessage } from '../api/api';

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
  const addAssistantMessageFn = async (message) => {
    await addAssistantMessage(message);
    await doFetchMessages();
    changeThread(message.threadId);
  };
  const doFetchMessages = async () => {
    fetchMessages().then((data) => {
      setMessages((prevMessages) => {
        // Filter out messages that are already in the state
        const newMessages = data.filter((message) => {
          return !prevMessages.some((prevMessage) => prevMessage.id === message.id);
        });
        return [...prevMessages, ...newMessages];
      });
    });
  };

  return (
    <MessageContext.Provider
      value={{ messages: messages, setMessages, activeThreadId, changeThread, doFetchMessages, addAssistantMessage: addAssistantMessageFn }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
