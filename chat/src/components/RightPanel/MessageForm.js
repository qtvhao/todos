// src/components/RightPanel/MessageForm.js
import React from 'react';
import useMessageForm from './hooks/useMessageForm';
import './MessageForm.css';

import { useMessages } from '../../context/MessageContext';
const MessageForm = () => {
  const { message, handleChange, handleSend, resetForm } = useMessageForm();
  const { doFetchMessages } = useMessages();

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSend({ text: message });
    doFetchMessages();

    // Reset the form after sending the message
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