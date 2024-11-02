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

    socket.on('notification', (message) => {
      console.log('Received message:', message);
    });
    socket.on('job_result', (message) => {
      console.log('Received message:', Object.keys(message));
      let todo_id = message.todo_id;
      let job_id = message.job_id;
      let result = message.result;
      console.log('todo_id:', todo_id);
      console.log('job_id:', job_id);
      console.log('result:', result);
    });

    return socket;
  } else {
    // console.error('Invalid token');
  }
};
export { connectWebSocket };
