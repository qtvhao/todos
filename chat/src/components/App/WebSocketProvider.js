// src/WebSocketProvider.js
import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { connectWebSocket } from '../../services/webSocketService';
import { WS_URL, STATIC_URL } from '../../constants';
import { useMessages } from '../../context/MessageContext';

export const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
  const { auth } = useAuth();
  const [ws, setWs] = useState(null);

  const { 
    addAssistantMessage,
  } = useMessages();

  useEffect(() => {
    if (auth) {
        let socket = connectWebSocket(WS_URL, auth.token);
        socket.on('notification', (message) => {
          console.log('Received message:', message);
        });
        socket.on('job_result', (message) => {
          message = JSON.parse(message);
          console.log('Received message:', Object.keys(message));
          let todo_id = message.todo_id;
          let job_id = message.job_id;
          let result = message.result;
          console.log('todo_id:', todo_id);
          console.log('job_id:', job_id);
          console.log('result:', result);
          let tokens = result.tokens
          let audioFile = result.audioFile?.replace('/app/storage/audio/', STATIC_URL);
          let formatted = result.formatted
          addAssistantMessage({
            audioFile: audioFile,
            formatted: formatted,
            tokens,
            text: formatted,
            sender: 'Assistant',
            threadId: todo_id,
            timestamp: Date.now()
          });
        });
        socket.on('disconnect', (reason) => {
          if (reason === 'io server disconnect') {
            console.log('Disconnected:', reason);
            alert('Disconnected from server. Please signup again.');
          }
          console.log('Disconnected:', reason);
        });
        setWs(socket);
        return () => {
          socket.disconnect();
        };
    }
    // eslint-disable-next-line
  }, [auth]);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
