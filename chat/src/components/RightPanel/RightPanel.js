// src/components/RightPanel/RightPanel.js
import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import LogoutButton from './LogoutButton';

const RightPanel = () => (
  <div className="right-panel">
    <LogoutButton />
    <MessageList />
    <MessageForm />
  </div>
);

export default RightPanel;