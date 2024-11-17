import { connectWebSocket } from '../services/webSocketService';

export const setupWebSocket = (url, token, eventHandlers) => {
  const socket = connectWebSocket(url, token);
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
  return socket;
};

export const reconnectWebSocket = (url, token, eventHandlers, retries = 5) => {
  let attempt = 0;
  const connect = () => {
    const socket = setupWebSocket(url, token, eventHandlers);
    socket.on('disconnect', (reason) => {
      if (attempt < retries) {
        setTimeout(() => connect(), Math.pow(2, attempt++) * 1000); // Exponential backoff
      }
    });
    return socket;
  };
  return connect();
};