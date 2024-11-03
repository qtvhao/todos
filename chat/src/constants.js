// src/constants.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const USERS_API = API_URL + '/';
export const FETCH_MESSAGES_ENDPOINT = `${API_URL}/messages`;
export const SEND_MESSAGE_ENDPOINT = `${API_URL}/todos`;
export const WS_URL = API_URL;
export const STATIC_URL = process.env.REACT_APP_API_URL + '/static/';
