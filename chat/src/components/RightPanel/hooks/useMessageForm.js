// src/components/RightPanel/hooks/useMessageForm.js
import { useState } from 'react';

const useMessageForm = (sendMessageCallback) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessageCallback(message);
    setMessage('');
  };

  return { message, setMessage, handleSubmit };
};

export default useMessageForm;
