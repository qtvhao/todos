// src/hooks/useWebSocket.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { connectWebSocket } from '../services/webSocketService';

const useWebSocket = (url) => {
  useEffect(() => {
    const token = Cookies.get('token');
    connectWebSocket(url, token);
  }, [url]);
};

export default useWebSocket;