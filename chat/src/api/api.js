// src/api/api.js
import axios from 'axios';
import { FETCH_MESSAGES_ENDPOINT, SEND_MESSAGE_ENDPOINT } from '../constants';

export const fetchMessages = async () => {
  const response = await axios.get(FETCH_MESSAGES_ENDPOINT);
  return response.data.messages;
};

export const sendMessage = async (message) => {
  const response = await axios.post(SEND_MESSAGE_ENDPOINT, { message });
  return response.data;
};
