// src/components/RightPanel/hooks/useMessageForm.js
import { useState } from 'react';

const useMessageForm = () => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => setMessage(e.target.value);
  const resetForm = () => setMessage('');
  
  return {
    message,
    handleChange,
    resetForm,
  };
};

export default useMessageForm;