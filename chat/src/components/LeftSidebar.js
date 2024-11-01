import React, { useContext } from 'react';
import { MessageContext } from '../context/MessageContext';

const LeftSidebar = () => {
  const { threads, addThread, selectThread } = useContext(MessageContext);

  return (
    <div className="left-sidebar">
      <h2>Threads</h2>
      <button onClick={addThread} className="add-thread-button">+ New Thread</button>
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
