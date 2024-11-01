// src/components/RightPanel/RightPanel.js
import React, { useContext } from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import { MessageContext } from '../../context/MessageContext';

const RightPanel = () => {
  const { messages, setMessages } = useContext(MessageContext);

  return (
    <div className="right-panel">
      <MessageList messages={messages} />
      <MessageForm setMessages={setMessages} />
    </div>
  );
};

export default RightPanel;