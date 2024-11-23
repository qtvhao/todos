import { openDB } from 'idb';
import axios from 'axios';
import { SEND_MESSAGE_ENDPOINT, ALIGN_TOKENS_ENDPOINT, TRANSLATE_TO_ENGLISH_ENDPOINT, VISUALIZE_MESSAGES_ENDPOINT } from '../constants';
import Cookies from 'js-cookie';

const dbPromise = openDB('chat-db', 1, {
  upgrade(db) {
    db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
  },
});

export const fetchMessages = async () => {
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');
  const messages = await store.getAll();
  await tx.done;
  return messages;
};
export const visualizeMessages = async (tokens, activeThreadId) => {
  const response = await axios.post(VISUALIZE_MESSAGES_ENDPOINT, {
    ...getAccessKeyPair(),
    jobData: {
      tokens_texts: tokens,
      activeThreadId,
    }
  });
  console.log(response);
}; //
export const alignTokens = async (flat, audioUrl, activeThreadId) => {
  const response = await axios.post(ALIGN_TOKENS_ENDPOINT, {
    ...getAccessKeyPair(),
    jobData: {
      tokens_texts: flat,
      activeThreadId,
      audio_file: audioUrl
    }
  });
  console.log(response);

  return response.data; // Giả sử API trả về dữ liệu cần thiết để lưu vào message
};
export const translateTokensToEnglish = async (flat, activeThreadId, headings) => {
  const response = await axios.post(TRANSLATE_TO_ENGLISH_ENDPOINT, {
    ...getAccessKeyPair(),
    jobData: {
      tokens_texts: flat,
      activeThreadId,
      headings,
    }
  });
  console.log(response);

  return response.data; // Giả sử API trả về dữ liệu cần thiết để lưu vào message
}; // Hàm mới để gọi alignTokens API và lưu kết quả
function getAccessKeyPair() {
  const token = Cookies.get('token');
  const [accessKeyId, secretAccessKey] = token.split(':');

  return {
    accessKeyId,
    secretAccessKey,
  }
}
export const sendMessage = async (message) => {
  const jobData = {
    format: 'text-with-audio',
    text: message,
  };
  const response = await axios.post(SEND_MESSAGE_ENDPOINT, {
    ...getAccessKeyPair(),
    jobData,
  });
  const {
    id,
    // user_id,
    // completed,
    // userId,
  } = response.data;
  // 
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  const newMessage = { 
    text: message,
    sender: 'You',
    threadId: id, 
    timestamp: Date.now() 
  };
  await store.add(newMessage);
  await tx.done;
  // 
  return newMessage;
};

export const addAssistantMessage = async (message) => {
 const db = await dbPromise;
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  await store.add(message);
  await tx.done;  
}

