// src/components/RightPanel/MessageForm.js
import React from 'react';
import { sendMessage } from '../../api/api';
import useMessageForm from './hooks/useMessageForm';

const MessageForm = ({ threadId, addMessageToThread }) => {
  const { message, setMessage, handleSubmit } = useMessageForm(async (msg) => {
    const newMessage = await sendMessage(msg);
    addMessageToThread(threadId, { ...newMessage, threadId });
  });

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;
