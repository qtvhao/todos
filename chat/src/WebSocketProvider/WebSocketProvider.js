import React, { useEffect, useState } from 'react';
import { WebSocketContext } from './WebSocketContext';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { setupWebSocket } from './webSocketUtils';
import { handleNotification, handleJobResult, handleDisconnect } from './webSocketHandlers';
import { WS_URL, WS_ALIGN_TOKEN_URL } from '../constants'

const WebSocketProvider = ({ children }) => {
  const { auth } = useAuth();
  const { addAssistantMessage } = useMessages();
  const [ws, setWs] = useState(null);
  const [wsAlignToken, setWsAlignToken] = useState(null);

  useEffect(() => {
    if (auth) {
      const mainSocket = setupWebSocket(WS_URL, auth.token, {
        notification: handleNotification,
        job_result: (msg) => handleJobResult(msg, addAssistantMessage),
        disconnect: handleDisconnect,
      });
      setWs(mainSocket);

      return () => mainSocket.disconnect();
    }
  }, [auth, addAssistantMessage]);

  useEffect(() => {
    if (auth) {
      const alignSocket = setupWebSocket(WS_ALIGN_TOKEN_URL, auth.token, {
        notification: handleNotification,
        disconnect: handleDisconnect,
        job_result: (msg) => handleJobResult(msg, addAssistantMessage),
      });
      setWsAlignToken(alignSocket);

      return () => alignSocket.disconnect();
    }
  }, [auth, addAssistantMessage]);

  return (
    <WebSocketContext.Provider value={{ ws, wsAlignToken }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;