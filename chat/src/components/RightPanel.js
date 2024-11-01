import React, { useContext, useState } from 'react';
import { MessageContext } from '../context/MessageContext';

const RightPanel = () => {
  const { messages, selectedThreadId, sendMessage } = useContext(MessageContext);
  const [newMessage, setNewMessage] = useState('');

  const currentMessages = messages[selectedThreadId] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="right-panel">
      <h2>Messages</h2>
      <div className="messages">
        {currentMessages.length > 0 ? (
          currentMessages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender}: </strong>
              <span>{msg.content}</span>
            </div>
          ))
        ) : (
          <p>This thread has no messages. Send the first message below:</p>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default RightPanel;