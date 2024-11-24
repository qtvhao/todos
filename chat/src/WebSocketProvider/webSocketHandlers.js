import { STATIC_URL, VISUALIZE_STATIC_URL } from "../constants";
import { ALIGN_TOKENS_ENDPOINT, TRANSLATE_TO_ENGLISH_ENDPOINT } from '../constants';

export const handleNotification = (message) => {
  console.log('Received notification:', message);
};

export const handleVisualizeJobProgress = (message, addAssistantMessage) => {
  let parsed = JSON.parse(message)
  console.log('Parsed:', parsed);
  let logs = parsed.logs;
  let logsObjects = logs.map((log) => {
    let eventName = log.split(':')[0];
    let eventData = log.substring(eventName.length + 1);
    return {
      eventName,
      eventData: JSON.parse(eventData),
    };
  });
  for (let log of logsObjects) {
    let { eventName, eventData } = log;
    console.log('Event name:', eventName);
    // console.log('Event data:', eventData);
    let {
      threadId,
      filePath,
    } = eventData;
    // 
    console.log('Thread ID:', threadId);
    // console.log('File path:', filePath);
    let filePaths = filePath.split('/');
    let basename = filePaths.pop();
    let folderName = filePaths.pop();
    let imageUrl = `${VISUALIZE_STATIC_URL}${folderName}/${basename}`;
    console.log('Image URL:', imageUrl);
  }
};

export const handleTranslateToEnglishJobResult = (message, addAssistantMessage) => {
  try {
    const parsed = JSON.parse(message);
    console.log('Parsed:', parsed);
    const { job_id, result } = parsed;
    let {
      processed_tokens_texts,
      active_thread_id,
      processed_headings,
    } = result;
    console.log('Job ID:', job_id);
    let text = `curl '${TRANSLATE_TO_ENGLISH_ENDPOINT}' \
-X 'POST' \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
--data-binary $'${JSON.stringify({
  tokens_texts: processed_tokens_texts.map(({ originalText }) => {return originalText}),
})}'`;
    
    console.log('Processed tokens:', processed_tokens_texts);
    console.log('Active thread id:', active_thread_id);
    console.log('Processed headings:', processed_headings);
    console.log('Parsed keys:', Object.keys(result));
    let tokens = []
      .concat(processed_headings.map((heading) => { return { ...heading, type: 'heading' } }))
      .concat(processed_tokens_texts.map((token) => { return { ...token, type: 'token' } }));
    addAssistantMessage({
      audioFile: null,
      formatted: null,
      tokens,
      text,
      sender: 'Assistant',
      threadId: active_thread_id,
      timestamp: Date.now(),
    });
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