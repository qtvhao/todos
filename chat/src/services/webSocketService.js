// src/services/webSocketService.js
import io from 'socket.io-client';

const connectWebSocket = (url, token) => {
  if (typeof token === 'string') {
    const [accessKeyId, secretAccessKey] = token.split(':');
    let query = {
      accessKeyId,
      secretAccessKey
    };

    const socket = io(url, { query });
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    return socket;
  }
};
export { connectWebSocket };
