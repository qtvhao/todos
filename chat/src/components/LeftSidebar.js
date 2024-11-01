// src/components/LeftSidebar.js
import React from "react";

const LeftSidebar = ({ threads, selectThread }) => {
  return (
    <div className="left-sidebar">
      <h2>Threads</h2>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id} onClick={() => selectThread(thread.id)}>
            <div className="thread">
              <h3>{thread.name}</h3>
              <p>{thread.lastMessage}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;