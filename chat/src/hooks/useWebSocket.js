// src/hooks/useWebSocket.js
import { useEffect } from 'react';
import { useMessages } from '../context/MessageContext';
import Cookies from 'js-cookie';
import io from 'socket.io-client';

const useWebSocket = (url) => {
  const { setMessages } = useMessages();

  useEffect(() => {
    const token = Cookies.get('token');
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
      // setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.disconnect();
  }, [url, setMessages]);
};

export default useWebSocket;
