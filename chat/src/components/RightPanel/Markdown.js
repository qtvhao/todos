// Markdown.js
import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify'; // Optional for sanitizing HTML

export const Markdown = ({ children }) => {
  const htmlContent = marked(children || '');

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(htmlContent), // Sanitizing with DOMPurify
      }}
    />
  );
};
