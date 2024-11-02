// src/hooks/useWebSocket.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { connectWebSocket } from '../services/webSocketService';
import { useMessages } from '../context/MessageContext';
import { WS_URL } from '../constants';

const useWebSocket = () => {
  const { 
    addAssistantMessage,
  } = useMessages();
  useEffect(() => {
    const token = Cookies.get('token');
    let socket = connectWebSocket(WS_URL, token);
    if (socket) {
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
        addAssistantMessage({
          text: JSON.stringify(result),
          sender: 'Assistant',
          threadId: todo_id,
          timestamp: Date.now()
        });
      });
      return () => {
        socket.disconnect();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
};

export default useWebSocket;