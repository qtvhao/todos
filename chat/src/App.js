// src/App.js
import React, { useState } from "react";
import LeftSidebar from "./components/LeftSidebar";
import RightPanel from "./components/RightPanel";
import "./App.css";

const App = () => {
  const [threads, setThreads] = useState([
    { id: 1, name: "Alice", lastMessage: "Hi, how are you?" },
    { id: 2, name: "Bob", lastMessage: "Are you coming to the meeting?" },
    { id: 3, name: "Charlie", lastMessage: "Don't forget the project!" }
  ]);
  
  const [messages, setMessages] = useState({
    1: [{ sender: "Alice", content: "Hi, how are you?" }],
    2: [{ sender: "Bob", content: "Are you coming to the meeting?" }],
    3: [{ sender: "Charlie", content: "Don't forget the project!" }]
  });

  const [selectedThreadId, setSelectedThreadId] = useState(null);

  const selectThread = (id) => {
    setSelectedThreadId(id);
  };

  return (
    <div className="app">
      <LeftSidebar threads={threads} selectThread={selectThread} />
      <RightPanel messages={messages[selectedThreadId]} />
    </div>
  );
};

export default App;
