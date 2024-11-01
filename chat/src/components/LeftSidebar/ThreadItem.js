// src/components/LeftSidebar/ThreadItem.js
import React from 'react';
import './ThreadItem.css';

const ThreadItem = ({ thread, isActive, onClick }) => {
  return (
    <div
      className={`thread-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span>{thread.name}</span>
    </div>
  );
};

export default ThreadItem;
