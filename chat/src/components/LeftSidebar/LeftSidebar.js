// src/components/LeftSidebar/LeftSidebar.js
import React, { useMemo } from 'react';
import { useMessages } from '../../context/MessageContext';
import ThreadItem from './ThreadItem';
import './LeftSidebar.css';

const LeftSidebar = () => {
  const { messages, activeThreadId, changeThread } = useMessages();

  // Group messages by threadId to display a list of threads
  const threads = useMemo(() => {
    const threadMap = {};
    messages.forEach((msg) => {
      if (!threadMap[msg.threadId]) {
        threadMap[msg.threadId] = { id: msg.threadId, name: `Thread ${msg.threadId}` };
      }
    });
    return Object.values(threadMap);
  }, [messages]);

  return (
    <div className="left-sidebar">
      <h2>Chats</h2>
      <div className="thread-list">
        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
            isActive={thread.id === activeThreadId}
            onClick={() => changeThread(thread.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
