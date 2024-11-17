// src/WebSocketProvider.js
import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { connectWebSocket } from '../../services/webSocketService';
import { WS_URL, STATIC_URL, WS_ALIGN_TOKEN_URL, ALIGN_TOKENS_ENDPOINT } from '../../constants';
import { useMessages } from '../../context/MessageContext';
import { setupWebSocket } from '../../WebSocketProvider/webSocketUtils'

export const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
  const { auth } = useAuth();
  const [ws, setWs] = useState(null);
  const [, setWsAlignToken] = useState(null);

  const { 
    addAssistantMessage,
  } = useMessages();

  useEffect(() => {
    if (auth) {
        const mainSocket = setupWebSocket(WS_URL, auth.token, {
            notification: (message) => {
                console.log('Received message:', message);
            },
            job_result: (message) => {
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
            },
            disconnect: (reason) => {
                if (reason === 'io server disconnect') {
                  console.log('Disconnected:', reason);
                  alert('Disconnected from server. Please signup again.');
                  window.location.href = '/signup';
                }
                console.log('Disconnected:', reason);
              },
        });
        setWs(mainSocket);
        return () => {
            mainSocket.disconnect();
        };
    }
    // eslint-disable-next-line
  }, [auth]);

  useEffect(() => {
    if (auth) { //
      let socket = connectWebSocket(WS_ALIGN_TOKEN_URL, auth.token);
      socket.on('notification', (message) => {
        console.log('Received message:', message);
      });
      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          console.log('Disconnected:', reason);
          alert('Disconnected from server. Please signup again.');
          window.location.href = '/signup';
        }
        console.log('Disconnected:', reason);
      });
      socket.on('job_result', (message) => {
        message = JSON.parse(message);
        console.log('Received message:', Object.keys(message));
        let result = message.result;
        let audioUrl = result.audio_url;
        let flat = result.flat;
        let payload = {
          "tokens_texts": flat,
          "audio_file": audioUrl,
        };
        let text = `curl '${ALIGN_TOKENS_ENDPOINT}' \
-X 'POST' \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
--data-binary $'${JSON.stringify(payload)}'`;
        let {
          active_thread_id,
          tokens,
        } = result;
        let newMessage = {
          audioFile: null,
          formatted: null,
          tokens,
          text,
          sender: 'Stablizer',
          threadId: active_thread_id,
          timestamp: Date.now()
        };
        console.log('New message (aligned_tokens):', newMessage);
        addAssistantMessage(newMessage);
      });
      setWsAlignToken(socket);
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
