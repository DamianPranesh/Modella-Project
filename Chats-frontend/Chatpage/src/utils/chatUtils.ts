import React, { useState, useEffect } from 'react';
import { Chat, RemoveAction } from '../data/sampleChats';

// Hook for managing chat operations like removal, message updates, and selection
export const useChatHandlers = (
  chats: Chat[],
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  selectedChatId: string | undefined,
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  // Handles chat removal based on action type (delete/unmatch)
  const handleRemoveChat = (chatId: string, action: RemoveAction) => {
    if (action === 'delete') {
      // For delete, we don't remove the chat from the list
      console.log(`Chat ${chatId} history cleared`);
      return;
    }
    
    // For unmatch actions, remove the chat from the list
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    // Clear selected chat if it was the one removed
    if (selectedChatId === chatId) {
      setSelectedChatId(undefined);
    }
    
    // Here you would typically make an API call based on the action
    console.log(`Chat ${chatId} removed with action: ${action}`);
  };

  // Updates the last message and timestamp of a specific chat
  const updateChatLastMessage = (chatId: string, message: string) => {
    setChats(prevChats => prevChats.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: message, timestamp: new Date() }
        : chat
    ));
  };

  // Handles chat selection
  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return {
    handleRemoveChat,
    updateChatLastMessage,
    handleChatSelect
  };
};

// Hook for managing responsive sidebar behavior
export const useResponsiveSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Handle window resize to update sidebar visibility
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

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return {
    isSidebarOpen,
    toggleSidebar
  };
}; 