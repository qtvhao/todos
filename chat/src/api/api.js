import { openDB } from 'idb';
import axios from 'axios';
import { SEND_MESSAGE_ENDPOINT, ALIGN_TOKENS_ENDPOINT, TRANSLATE_TO_ENGLISH_ENDPOINT, VISUALIZE_MESSAGES_ENDPOINT } from '../constants';
import Cookies from 'js-cookie';
import OpenAI from "openai";


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
  const openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: getOpenAIConnection()[0],
    baseURL: getOpenAIConnection()[1],
  });
  let systemPrompt = `System Prompt: Keyword Extraction Tool

“You are a highly efficient and intelligent assistant designed to analyze articles and extract the most relevant keywords. Your task is to:
	1.	Identify significant words or phrases that summarize the key ideas of the given text.
	2.	Focus on nouns, verbs, and proper names that are central to the article’s topic.
	3.	Avoid generic or overly common words unless they are integral to the content.
	4.	Return 10–20 concise and contextually appropriate keywords.

Ensure that the keywords:
	•	Are directly relevant to the article’s main points.
	•	Reflect the themes, concepts, or subjects discussed.
	•	Are suitable for indexing, categorization, or search optimization purposes.”

If you understand the instructions, begin processing the provided text and extract the keywords.`
  let model = "mistralai/Mistral-Nemo-Instruct-2407";
  console.log(tokens);
  let keywordsResponse = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: tokens.join(" ") },
    ],
  });
  let choice = keywordsResponse.choices[0];
  if ("stop" !== choice.finish_reason) {
    console.log("ERROR: Model stopped early");
    return;
  }
  let keywords = choice.message.content;
  console.log(keywords);
  // 

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
function getOpenAIConnection() {
  let key = Cookies.get('OPENAI_API_KEY');
  let base = Cookies.get('OPENAI_API_BASE');
  if (!base) {
    base = 'https://api.deepinfra.com/v1/openai';
  }

  if (!key) {
    // prompt user to enter key
    key = prompt('Please enter your OpenAI API key');
    Cookies.set('OPENAI_API_KEY', key);
  }

  return [key, base];
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

