import React, { createContext, useReducer, useEffect } from 'react';
import { initializeSocket, sendMessageAPI } from '../api';

export const MessageContext = createContext();

const initialState = {
  threads: [
    { id: 1, name: 'Alice', lastMessage: 'Hi, how are you?' },
    { id: 2, name: 'Bob', lastMessage: 'Are you coming to the meeting?' },
    { id: 3, name: 'Charlie', lastMessage: 'Don\'t forget the project!' }
  ],
  messages: {
    1: [{ sender: 'Alice', content: 'Hi, how are you?' }],
    2: [{ sender: 'Bob', content: 'Are you coming to the meeting?' }],
    3: [{ sender: 'Charlie', content: 'Don\'t forget the project!' }]
  },
  selectedThreadId: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_THREAD':
      const newThreadId = state.threads.length + 1;
      const newThread = { id: newThreadId, name: `New Thread ${newThreadId}`, lastMessage: 'No messages yet' };
      return {
        ...state,
        threads: [...state.threads, newThread],
        messages: { ...state.messages, [newThreadId]: [] },
        selectedThreadId: newThreadId
      };

    case 'SELECT_THREAD':
      return { ...state, selectedThreadId: action.payload };

    case 'ADD_MESSAGE':
      const { threadId, message } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [threadId]: [...(state.messages[threadId] || []), message]
        },
        threads: state.threads.map(thread =>
          thread.id === threadId
            ? { ...thread, lastMessage: message.content }
            : thread
        )
      };

    default:
      return state;
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Initialize WebSocket and define onMessageReceived callback
    initializeSocket((message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: { threadId: message.threadId, message } });
    });
  }, []);

  const addThread = () => dispatch({ type: 'ADD_THREAD' });

  const selectThread = (id) => dispatch({ type: 'SELECT_THREAD', payload: id });

  const sendMessage = async (content) => {
    if (!state.selectedThreadId) return;
    const newMessage = await sendMessageAPI(state.selectedThreadId, content);
    dispatch({ type: 'ADD_MESSAGE', payload: { threadId: state.selectedThreadId, message: newMessage } });
  };

  return (
    <MessageContext.Provider value={{ ...state, addThread, selectThread, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};