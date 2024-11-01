// src/components/RightPanel/hooks/useMessageForm.js
import { useState } from 'react';
import { sendMessage } from '../../../api/api';

const useMessageForm = () => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => setMessage(e.target.value);
  const resetForm = () => setMessage('');
  const handleSend = async (message) => {
    await sendMessage(message);
  };
  
  return {
    handleSend,
    message,
    handleChange,
    resetForm,
  };
};

export default useMessageForm;