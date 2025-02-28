import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatList } from "./components/ChatList";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string>();

  // Sample chat data - replace with your actual data
  const sampleChats = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'The meeting is at 3 PM',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'The meeting is at 3 PM',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'The meeting is at 3 PM',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 0,
      isOnline: false
    }
    ,
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'The meeting is at 3 PM',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 7,
      isOnline: false
    },
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 6,
      isOnline: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'The meeting is at 3 PM',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 5,
      isOnline: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'The meeting is at 3 PM',
      timestamp: new Date(),
      avatar: 'https://via.placeholder.com/40',
      unreadCount: 0,
      isOnline: false
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
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

      {/* ChatList */}
      <div className={`w-[350px] h-screen overflow-hidden ${isSidebarOpen ? 'ml-[250px]' : ''} transition-all duration-300`}>
        <ChatList 
          chats={sampleChats}
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChatId}
        />
      </div>
    </div>
  );
}

export default App;
