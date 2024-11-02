// src/components/RightPanel/MessageForm.js
import React from 'react';
import useMessageForm from './hooks/useMessageForm';
import './MessageForm.css';
import {
  SEND_MESSAGE_ENDPOINT,
} from '../../constants';

import { useMessages } from '../../context/MessageContext';
const MessageForm = () => {
  const { message, handleChange, dataBinary, handleSend, resetForm } = useMessageForm();
  const { doFetchMessages, activeThreadId } = useMessages();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await handleSend(message, activeThreadId);
      resetForm(); // Clear the input after sending
      doFetchMessages();
    }
  };

  return (
    <div>
      <small>
        <pre className="curl-command">
          curl '{SEND_MESSAGE_ENDPOINT}' \ <br />
          -X 'POST' \ <br />
          -H 'Content-Type: application/json' \ <br />
          --data-binary '{dataBinary}'
        </pre>
      </small>
      <form className="message-form" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={handleChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageForm;
