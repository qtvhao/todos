// src/components/RightPanel/hooks/useMessageForm.js
import { useState } from 'react';
import { sendMessage } from '../../../api/api';
import Cookies from 'js-cookie';

const useMessageForm = () => {
  const [message, setMessage] = useState('');
  const [dataBinary, setDataBinary] = useState('');

  const handleChange = (e) => {
    const token = Cookies.get('token');
    const [accessKeyId, secretAccessKey] = token.split(':');
    setMessage(e.target.value);
    setDataBinary(JSON.stringify({ 
      "accessKeyId": accessKeyId,
      "secretAccessKey": secretAccessKey, 
      "title": e.target.value, 
      "description": e.target.value
    }, null, 2));
  };
  const resetForm = () => setMessage('');
  const handleSend = async (message, threadId) => {
    await sendMessage(message, threadId);
  };
  
  return {
    handleSend,
    message,
    dataBinary,
    handleChange,
    resetForm,
  };
};

export default useMessageForm;