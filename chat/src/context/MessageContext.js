// src/context/MessageContext.js
import removeMd from 'remove-markdown';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { fetchMessages, addAssistantMessage, translateTokensToEnglish, alignTokens } from '../api/api';

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
    setActiveThreadId(message.threadId);
  };
  function flatten(tokens) {
    return tokens.map(token => {
      if (token.type === 'list') {
        return token.items.map(item => item.text);
      }
      if (token.type === 'list_item') {
        return token.text;
      }
      if (token.type === 'paragraph') {
        return token.text;
      }
      if (token.type === 'heading') {
        return token.text;
      }
      if (token.type === 'space') {
        return '';
      }
      return token.text;
    }).flat().filter(str => str !== '').map(str => removeMd(str));
  }
  // Hàm mới để gọi alignTokens API và lưu kết quả
  const handleAlignTokens = async (tokens, audioUrl, activeThreadId) => {
    let flat = flatten(tokens);
    await alignTokens(flat, audioUrl, activeThreadId);
  };

  const handleTranslateTokensToEnglish = async (tokens, activeThreadId) => {
    let flat = flatten(tokens);
    console.log('flat:', flat);
    await translateTokensToEnglish(flat, activeThreadId);
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
      value={{ messages: messages, setMessages, activeThreadId, changeThread, doFetchMessages, addAssistantMessage: addAssistantMessageFn, handleTranslateTokensToEnglish, handleAlignTokens }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
