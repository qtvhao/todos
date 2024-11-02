// src/components/RightPanel/MessageList.js
import React from 'react';
import { useMessages } from '../../context/MessageContext';
import './MessageList.css';
import Cookies from 'js-cookie';

const MessageList = () => {
  const { messages, activeThreadId } = useMessages();

  const filteredMessages = messages.filter((msg) => msg.threadId === activeThreadId);
  const token = Cookies.get('token');
  const [accessKeyId, secretAccessKey] = token.split(':');
  const query = {
    accessKeyId,
    secretAccessKey
  };
  const opts = { query };

  return (
    <div className="message-list">
      <div class="message-item" style={{ whiteSpace: 'pre' }}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
        const socket = io(url, { JSON.stringify(opts, null, 2) }); <br />
        socket.on('connect', {"() => {"} <br />
        &nbsp;  console.log('Connected to WebSocket'); <br />
        {"});"} <br />
        {/*  */}
        socket.on('job_result', {"(message) => {"} <br />
          console.log('Received message:', Object.keys(message)); <br /> &nbsp;
          let todo_id = message.todo_id; <br /> &nbsp;
          let job_id = message.job_id; <br /> &nbsp;
          let result = message.result; <br /> &nbsp;
          console.log('todo_id:', todo_id); <br /> &nbsp;
          console.log('job_id:', job_id); <br /> &nbsp;
          console.log('result:', result); <br />
        {"});"} <br />
        </pre>
      </div>
      {filteredMessages.map((msg, index) => (
        <div key={index} className="message-item">
          <strong>{msg.user}</strong>: {msg.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
