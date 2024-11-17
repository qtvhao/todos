import { STATIC_URL } from "../constants";

export const handleNotification = (message) => {
  console.log('Received notification:', message);
};

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

export const handleDisconnect = (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    alert('Disconnected from server. Please signup again.');
    window.location.href = '/signup';
  }
};