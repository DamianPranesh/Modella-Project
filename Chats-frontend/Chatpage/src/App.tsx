import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatList } from "./components/ChatList";
import StartMessage from "./components/StartMessage";
import { ChatPage } from "./components/Chatpage";
import { Chat } from "./data/sampleChats";
import { useChatHandlers, useResponsiveSidebar } from "./utils/chatUtils";
import { MessageCircle } from 'lucide-react';

function App() {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [chats, setChats] = useState<Chat[]>([]); // Removed sampleChats
  
  // Mock current user ID - replace with actual user authentication
  const currentUserId = "current-user";

  const { handleRemoveChat, updateChatLastMessage, handleChatSelect } = useChatHandlers(
    chats,
    setChats,
    selectedChatId,
    setSelectedChatId
  );    

  const { isSidebarOpen, toggleSidebar } = useResponsiveSidebar();

  // Get the selected chat data
  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* ChatList */}
      <div className={`w-[400px] h-screen overflow-hidden ${isSidebarOpen ? 'ml-[250px]' : ''} transition-all duration-300`}>
        <ChatList 
          chats={chats}
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChatId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-screen">
        {selectedChatId ? (
          <ChatPage
            key={selectedChatId}
            selectedChat={selectedChat}
            currentUserId={currentUserId}
            onMessageSent={(message) => updateChatLastMessage(selectedChatId, message)}
            onRemoveChat={handleRemoveChat}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <MessageCircle size={48} />
            <StartMessage />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;