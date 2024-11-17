import { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};