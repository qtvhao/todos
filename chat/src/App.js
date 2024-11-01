import React from 'react';
import { MessageProvider } from './context/MessageContext';
import LeftSidebar from './components/LeftSidebar';
import RightPanel from './components/RightPanel';
import './App.css';

const App = () => {
  return (
    <MessageProvider>
      <div className="app">
        <LeftSidebar />
        <RightPanel />
      </div>
    </MessageProvider>
  );
};

export default App;
