// src/hooks/useWebSocket.js
import { useEffect } from 'react';
import { API_URL } from '../constants';

const useWebSocket = (setMessages) => {
  useEffect(() => {
    const socket = new WebSocket(`${API_URL}/ws`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => socket.close();
  }, [setMessages]);
};

export default useWebSocket;
