// src/components/RightPanel/MessageList.js
import React from 'react';
import { useMessages } from '../../context/MessageContext';
import './MessageList.css';

const MessageList = () => {
  const { messages, activeThreadId } = useMessages();

  const filteredMessages = messages.filter((msg) => msg.threadId === activeThreadId);

  return (
    <div className="message-list">
      {filteredMessages.map((msg, index) => (
        <div key={index} className="message-item">
          <strong>{msg.user}</strong>: {msg.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
