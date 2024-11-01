// src/api/api.js
import { API_URL } from '../constants';
import Cookies from 'js-cookie';

const getAuthHeaders = () => {
  const accessKeyId = Cookies.get('accessKeyId');
  const secretAccessKey = Cookies.get('secretAccessKey');
  return {
    'X-Access-Key-Id': accessKeyId,
    'X-Secret-Access-Key': secretAccessKey,
  };
};

export const fetchMessages = async () => {
  const response = await fetch(`${API_URL}/messages`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();

  return data.messages;
};

export const sendMessage = async (message) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  });
  return response.json();
};
