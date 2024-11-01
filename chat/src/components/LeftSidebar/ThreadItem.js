// src/components/LeftSidebar/ThreadItem.js
import React from 'react';

const ThreadItem = ({ threadId, active, onClick }) => (
  <div
    className={`thread-item ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {threadId}
  </div>
);

export default ThreadItem;
