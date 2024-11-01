// src/components/LeftSidebar/LeftSidebar.js
import React, { useContext } from 'react';
import { MessageContext } from '../../context/MessageContext';
import ThreadItem from './ThreadItem';

const LeftSidebar = () => {
  const { threads, activeThread, setActiveThread } = useContext(MessageContext);

  return (
    <div className="left-sidebar">
      <h3>Conversations</h3>
      {Object.keys(threads).map((threadId) => (
        <ThreadItem
          key={threadId}
          threadId={threadId}
          active={threadId === activeThread}
          onClick={() => setActiveThread(threadId)}
        />
      ))}
    </div>
  );
};

export default LeftSidebar;
