import React from 'react';
import { useCallback } from 'react';
import { useMessages } from '../../context/MessageContext';
import './MessageList.css';
import Cookies from 'js-cookie';
import { WS_URL } from '../../constants';
import { Markdown } from './Markdown';

const MessageList = () => {
  const { messages, activeThreadId, handleAlignTokens } = useMessages();

  const filteredMessages = messages.filter((msg) => msg.threadId === activeThreadId);
  const token = Cookies.get('token');
  const [accessKeyId, secretAccessKey] = token.split(':');
  const query = {
    accessKeyId,
    secretAccessKey
  };
  const opts = { query };

  // Hàm xử lý sự kiện click của button "Align tokens"
  const alignTokensAndSaveMessage = useCallback(() => {
    const tokens = filteredMessages.find(msg => msg.tokens)?.tokens; // Lấy tokens đầu tiên
    const audioUrl = filteredMessages.find(msg => msg.audioFile)?.audioFile; // Lấy URL audio đầu tiên
    handleAlignTokens(tokens, audioUrl, activeThreadId);
  }, [filteredMessages, handleAlignTokens, activeThreadId]);

  const translateMessagesToEnglish = useCallback(() => {}, []);

  return (
    <div className="message-list">
      <div className="message-item" style={{ whiteSpace: 'pre' }}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
        import io from 'socket.io-client'; <br />
        const socket = io({JSON.stringify(WS_URL)}, { JSON.stringify(opts, null, 2) }); <br />
        socket.on('connect', {"() => {"} <br />
        &nbsp;  console.log('Connected to WebSocket'); <br />
        {"});"} <br />
        {/*  */}
        socket.on('job_result', {"(message) => {"} <br /> &nbsp;
          let todo_id = message.todo_id; <br /> &nbsp;
          let job_id = message.job_id; <br /> &nbsp;
          let result = message.result; <br /> &nbsp;
          console.log('todo_id:', todo_id); <br /> &nbsp;
          console.log('job_id:', job_id); <br /> &nbsp;
          console.log('result:', result); <br /> &nbsp;
          console.log('audioFile:', result.audioFile); <br /> &nbsp;
          console.log('formatted:', result.formatted); <br /> &nbsp;
          console.log('texts:', result.texts); <br />
        {"});"} <br />
        </pre>
      </div>
      {filteredMessages.map((msg, index) => {
        const tokens = msg.tokens?.map((token) => {
          delete token.raw;
          delete token.tokens;
          token.items = token.items?.map((item) => {
            delete item.raw;
            delete item.tokens;
            return item;
          });
          return token;
        });
        return (
          <div key={index}>
            <div className="message-item" style={{ overflowY: 'auto', textWrap: 'wrap' }}>
            
              {msg.audioFile && (
                <div style={{ marginBottom: '30px' }}>
                  <strong>console.log(msg.audioFile);</strong>
                  <audio controls src={msg.audioFile} autoPlay />
                </div>
              )}
              <strong>console.log(msg.text);</strong>
              <Markdown>{msg.text}</Markdown>
  
              {tokens && (
                <div>
                  <strong>console.log(msg.tokens);</strong>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(tokens, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className="button-container">
        <div className="button-group">
          <button
            className="transcribe-button"
            onClick={alignTokensAndSaveMessage}
            disabled={!activeThreadId}
          >
            Transcribe
          </button>
          <button
            className="translate-button"
            onClick={translateMessagesToEnglish}
            disabled={filteredMessages.length === 0}
          >
            Translate to English
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
