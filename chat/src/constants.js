// src/constants.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const USERS_API = API_URL + '/';
export const FETCH_MESSAGES_ENDPOINT = `${API_URL}/messages`;
export const SEND_MESSAGE_ENDPOINT = `${API_URL}/todos`;
export const WS_URL = API_URL;
export const STATIC_URL = process.env.REACT_APP_API_URL + '/static/';

export const ALIGN_TOKENS_ENDPOINT = `https://http-align-partnerapis-production-80.schnworks.com/stablize`;
export const WS_ALIGN_TOKEN_URL = process.env.REACT_APP_WS_ALIGN_TOKEN_URL || 'http://localhost:3000';
