// src/components/RightPanel/MessageList.js
import React from 'react';

const MessageList = ({ messages }) => (
  <div className="message-list">
    {messages.map((msg, index) => (
      <div key={index} className="message-item">
        {msg.text}
      </div>
    ))}
  </div>
);

export default MessageList;
