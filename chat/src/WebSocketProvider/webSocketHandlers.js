import { STATIC_URL } from "../constants";
import { ALIGN_TOKENS_ENDPOINT,  } from '../constants';

export const handleNotification = (message) => {
  console.log('Received notification:', message);
};

export const handleTranslateToEnglishJobResult = (message, addAssistantMessage) => {
  try {
    const parsed = JSON.parse(message);
    console.log('Parsed:', parsed);
  }catch (error) {
    console.error('Error handling job_result:', error);
  }
}

export const handleJobResult = (message, addAssistantMessage) => {
  try {
    const parsed = JSON.parse(message);
    const { todo_id, result } = parsed;
    const audioFile = result.audioFile?.replace('/app/storage/audio/', STATIC_URL);
    const formatted = result.formatted;
    addAssistantMessage({
      audioFile,
      formatted,
      tokens: result.tokens,
      text: formatted,
      sender: 'Assistant',
      threadId: todo_id,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error handling job_result:', error);
  }
};

export const handleAlignJobResult = (message, addAssistantMessage) => {
  message = JSON.parse(message);
  console.log('Received message:', Object.keys(message));
  let result = message.result;
  let audioUrl = result.audio_url;
  let flat = result.flat;
  let payload = {
    "tokens_texts": flat,
    "audio_file": audioUrl,
  };
  let text = `curl '${ALIGN_TOKENS_ENDPOINT}' \
-X 'POST' \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
--data-binary $'${JSON.stringify(payload)}'`;
  let {
    active_thread_id,
    tokens,
  } = result;
  let newMessage = {
    audioFile: null,
    formatted: null,
    tokens,
    text,
    sender: 'Stablizer',
    threadId: active_thread_id,
    timestamp: Date.now()
  };
  console.log('New message (aligned_tokens):', newMessage);
  addAssistantMessage(newMessage);
};

export const handleDisconnect = (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    alert('Disconnected from server. Please signup again.');
    window.location.href = '/signup';
  }
};