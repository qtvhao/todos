// src/components/RightPanel/RightPanel.js
import React, { useContext } from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import { MessageContext } from '../../context/MessageContext';

const RightPanel = () => {
  const { threads, activeThread, addMessageToThread } = useContext(MessageContext);
  const messages = threads[activeThread] || [];

  return (
    <div className="right-panel">
      <MessageList messages={messages} />
      <MessageForm threadId={activeThread} addMessageToThread={addMessageToThread} />
    </div>
  );
};

export default RightPanel;
