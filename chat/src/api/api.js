// src/api/api.js
import { API_URL } from '../constants';

export const fetchMessages = async () => {
  const response = await fetch(`${API_URL}/messages`);
  const data = await response.json();

  return data;
};

export const sendMessage = async (message) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });
  return response.json();
};
