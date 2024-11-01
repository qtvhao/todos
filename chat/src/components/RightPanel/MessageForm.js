// src/components/RightPanel/MessageForm.js
import React from 'react';
import useMessageForm from './hooks/useMessageForm';
import { sendMessage } from '../../api/api';
import './MessageForm.css';

const MessageForm = () => {
  const { message, handleChange, handleSend, resetForm } = useMessageForm();

  const onSubmit = async (e) => {
    e.preventDefault();
    await sendMessage({ text: message });
    resetForm(); // Clear the input after sending
  };

  return (
    <form className="message-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={handleChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;