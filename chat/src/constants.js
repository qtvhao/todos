// src/constants.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const FETCH_MESSAGES_ENDPOINT = `${API_URL}/messages`;
export const SEND_MESSAGE_ENDPOINT = `${API_URL}/todos`;
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3000';
