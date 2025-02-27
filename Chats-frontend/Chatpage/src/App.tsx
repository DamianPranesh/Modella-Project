import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatList } from "./components/Messagelist";
 // Import the ChatMessages component

interface ChatMessagesProps {}

export const ChatMessages: React.FC<ChatMessagesProps> = () => {
  return (
    <div className="chat-messages">
      {/* Chat messages content */}
    </div>
  );
};

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isChatListOpen, setChatListOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleChatList = () => {
    setChatListOpen(!isChatListOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
        setChatListOpen(true);
      } else {
        setSidebarOpen(false);
        setChatListOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* ChatMessages should fill the space between Sidebar and ChatList */}
      <ChatMessages /> {/* Chat Messages here */}

      {/* ChatList */}
      <ChatList isOpen={isChatListOpen} toggleChatList={toggleChatList} />
    </div>
  );
}

export default App;
