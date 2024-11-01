import { openDB } from 'idb';
import axios from 'axios';
import { SEND_MESSAGE_ENDPOINT } from '../constants';
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

export const sendMessage = async (message, threadId) => {
  const token = Cookies.get('token');
  console.log('token', token);
  const [accessKeyId, secretAccessKey] = token.split(':');
  const response = await axios.post(SEND_MESSAGE_ENDPOINT, {
    accessKeyId,
    secretAccessKey,
    title: 'Test Todo',
    description: 'This is a test todo',
  });
  console.log('response', response.data);
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
    threadId: threadId ? threadId:id, 
    timestamp: Date.now() 
  };
  await store.add(newMessage);
  await tx.done;
  // 
  return newMessage;
};
