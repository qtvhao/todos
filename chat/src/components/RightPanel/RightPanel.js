// src/components/RightPanel/RightPanel.js
import React, { useContext } from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import LogoutButton from './LogoutButton';
import { MessageContext } from '../../context/MessageContext';

const RightPanel = () => {
  const { activeThread, addMessageToThread } = useContext(MessageContext);
  const { messages } = useContext(MessageContext);

  return (
    <div className="right-panel">
      <LogoutButton />
      <MessageList messages={messages} />
      <MessageForm threadId={activeThread} addMessageToThread={addMessageToThread} />
    </div>
  );
};

export default RightPanel;