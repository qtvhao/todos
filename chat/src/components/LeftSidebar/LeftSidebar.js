// src/components/LeftSidebar/LeftSidebar.js
import React from 'react';
import ThreadItem from './ThreadItem';

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <h3>Conversations</h3>
      <ThreadItem thread="General" />
      <ThreadItem thread="Random" />
    </div>
  );
};

export default LeftSidebar;