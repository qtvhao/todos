// src/context/MessageContext.js
import removeMd from 'remove-markdown';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { fetchMessages, addAssistantMessage, alignTokens } from '../api/api';

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
    try {
      let flat = flatten(tokens);
      const result = await alignTokens(flat, audioUrl);
      let newMessage
      //  = {
      //   text: result.text, // Giả sử response có trường `text`
      //   sender: 'Assistant',
      //   threadId: activeThreadId,
      //   timestamp: Date.now(),
      //   audioFile: result.audioFile // Nếu có audio URL trong response
      // };
      let text = `curl 'https://http-stablize-partnerapis-production-80.schnworks.com/stablize' \
-X 'POST' \
-H 'Accept: application/json, text/plain, */*' \
-H 'Content-Type: application/json' \
--data-binary $'${JSON.stringify({
  "tokens_texts": flat,
  "audio_file": audioUrl
})}'`;
      newMessage = {
        audioFile: null,
        formatted: null,
        tokens: result,
        text,
        sender: 'Stablizer',
        threadId: activeThreadId,
        timestamp: Date.now()
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Error aligning tokens:", error);
    }
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
      value={{ messages: messages, setMessages, activeThreadId, changeThread, doFetchMessages, addAssistantMessage: addAssistantMessageFn, handleAlignTokens }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
