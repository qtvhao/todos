// src/WebSocketProvider.js
import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WS_URL, WS_ALIGN_TOKEN_URL, } from '../constants';
import { useMessages } from '../context/MessageContext';
import { setupWebSocket } from '../WebSocketProvider/webSocketUtils'
import { handleNotification, handleJobResult, handleDisconnect } from '../WebSocketProvider/webSocketHandlers';

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
            notification: handleNotification,
            job_result: (message) => { handleJobResult(message, addAssistantMessage) },
            disconnect: handleDisconnect,
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
      const alignSocket = setupWebSocket(WS_ALIGN_TOKEN_URL, auth.token, {
        notification: handleNotification,
        job_result: (message) => { handleJobResult(message, addAssistantMessage) },
        disconnect: handleDisconnect
      });
      setWsAlignToken(alignSocket);

      return () => {
        alignSocket.disconnect();
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
