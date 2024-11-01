// src/components/RightPanel/MessageForm.js
import React, { useContext } from 'react';
import { sendMessage } from '../../api/api';
import useMessageForm from './hooks/useMessageForm';
import { MessageContext } from '../../context/MessageContext';

const MessageForm = () => {
  const { setMessages } = useContext(MessageContext);
  const { message, setMessage, handleSubmit } = useMessageForm(async (msg) => {
    const newMessage = await sendMessage(msg);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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
