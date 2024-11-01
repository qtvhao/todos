// src/components/App/App.js
import React from 'react';
import { MessageProvider } from '../../context/MessageContext';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import RightPanel from '../RightPanel/RightPanel';
import './App.css';

function App() {
  return (
    <MessageProvider>
      <div className="app-container">
        <LeftSidebar />
        <RightPanel />
      </div>
    </MessageProvider>
  );
}

export default App;
