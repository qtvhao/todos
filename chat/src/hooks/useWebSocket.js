// src/hooks/useWebSocket.js
import { useEffect } from 'react';
import { useMessages } from '../context/MessageContext';

const useWebSocket = (url) => {
  const { setMessages } = useMessages();

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => ws.close();
  }, [url, setMessages]);

  return ws;
};

export default useWebSocket;
