// src/components/RightPanel/hooks/useMessageForm.js
import { useState, useEffect } from 'react';
import { sendMessage } from '../../../api/api';
import Cookies from 'js-cookie';

const useMessageForm = () => {
  const [message, setMessage] = useState('');
  const [dataBinary, setDataBinary] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const token = Cookies.get('token');
    const [accessKeyId, secretAccessKey] = token.split(':');
    setDataBinary(JSON.stringify({ 
      "accessKeyId": accessKeyId,
      "secretAccessKey": secretAccessKey, 
      "jobData": {
        "format": "text-with-audio",
        "text": message
      },
    }, null, 2).replace(/\n/g, '\n   '));
  }, [message]);
  const resetForm = () => setMessage('');
  const handleSend = async (message, threadId) => {
    return await sendMessage(message, threadId);
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