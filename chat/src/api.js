import axios from 'axios';
import { API_BASE_URL } from './constants';

let socket;

// Initialize WebSocket connection using the base URL
export const initializeSocket = (onMessageReceived) => {
  socket = new WebSocket(`${API_BASE_URL.replace(/^http/, 'ws')}`);
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessageReceived(message);
  };
};

// Send a message to the server using the base URL
export const sendMessageAPI = async (threadId, content) => {
  const response = await axios.post(`${API_BASE_URL}/generate`, { threadId, content });
  return response.data;  // Returns the new message from the server
};
