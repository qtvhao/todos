// src/components/RightPanel.js
import React from "react";

const RightPanel = ({ messages }) => {
  if (!messages) {
    return <div className="right-panel">Select a thread to view messages</div>;
  }

  return (
    <div className="right-panel">
      <h2>Messages</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;