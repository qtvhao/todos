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
  let systemPrompt = `Analyze the provided text and extract a concise list of the 10-15 most relevant keywords or phrases that capture the main topics, themes, and key ideas. Focus on terms that are unique, essential, or frequently mentioned, prioritizing those that are critical to understanding the text’s content and purpose. Format the output as follows:

---

[Log] Based on the provided text, here are the most relevant keywords:
	1.	[Keyword 1]: [Short explanation if necessary].
	2.	[Keyword 2]: [Optional description].
	3.	…
	4.	[Keyword 15]: [Optional description].

---

The keywords should be well-suited for indexing, categorization, or search engine optimization, and avoid generic or overly broad terms unless they are critical to the topic.`
  let model = "mistralai/Mistral-Nemo-Instruct-2407";
  console.log(tokens);
  let keywordsResponse = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: tokens.join("\n\n") },
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
      keywords: keywords,
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
    key = prompt('Please enter your DeepInfra API key');
    if (!key) {
      alert('API key is required. Get your API key at https://deepinfra.com');
      throw new Error('API key is required');
    }
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

export const addVisualMessage = async (imageUrl, threadId) => {
  console.log('Adding visual message:', imageUrl, threadId);
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  const imageMarkdown = `${imageUrl}
`;
  // const imageMarkdown = `![Visual](${imageUrl})`;
  const newMessage = {
    text: imageMarkdown,
    sender: 'Visual',
    threadId,
    timestamp: Date.now()
  };

  const messages = await store.getAll();
  const existingMessage = messages.find(m => {
    let isSameThread = m.threadId === threadId;
    if (!isSameThread) {
      return false;
    }

    let isVisual = m.sender === 'Visual';
    if (!isVisual) {
      return false;
    }
    
    let isSameText = m.text === imageMarkdown;

    return isSameText;
  });
  if (existingMessage) {
    console.log('Updating existing visual message:', imageUrl, threadId, existingMessage);
    await store.put({
      id: existingMessage.id,
      ...newMessage,
    });
  } else {
    console.log('Adding new visual message:', imageUrl, threadId);
    await store.add(newMessage);
  }
};

