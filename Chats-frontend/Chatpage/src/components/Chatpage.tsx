import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'text' | 'document' | 'image';
  fileName?: string;
}

type RemoveAction = 'unmatch' | 'unmatch_and_report' | 'delete';

interface ChatPageProps {
  selectedChat?: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    unreadCount?: number;
  };
  currentUserId: string;
  onMessageSent: (message: string) => void;
  onRemoveChat: (chatId: string, action: RemoveAction) => void;
  onChatOpened?: (chatId: string) => void;
}

export function ChatPage({ selectedChat, currentUserId, onMessageSent, onRemoveChat, onChatOpened }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{
    show: boolean;
    action: RemoveAction | null;
    title: string;
    message: string;
  }>({
    show: false,
    action: null,
    title: '',
    message: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (selectedChat?.id && onChatOpened) {
      onChatOpened(selectedChat.id);
    }
  }, [selectedChat?.id, onChatOpened]);

  // Handle clicking outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset messages when switching chats
  useEffect(() => {
    setMessages([]);
  }, [selectedChat?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedChat) return;

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const message: Message = {
        id: Date.now().toString(),
        content: URL.createObjectURL(file),
        fileName: file.name,
        timestamp: new Date(),
        senderId: currentUserId,
        senderName: 'You',
        senderAvatar: 'your-avatar-url',
        type: isImage ? 'image' : 'document'
      };

      setMessages(prev => [...prev, message]);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      senderId: currentUserId,
      senderName: 'You',
      senderAvatar: 'your-avatar-url',
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');
    onMessageSent(newMessage);
  };

  const handleRemoveAction = (action: RemoveAction) => {
    const confirmationMessages = {
      unmatch: {
        title: 'Confirm Unmatch',
        message: 'Are you sure you want to unmatch with this person? This action cannot be undone.'
      },
      unmatch_and_report: {
        title: 'Confirm Unmatch & Report',
        message: 'Are you sure you want to unmatch and report this person? This action cannot be undone.'
      },
      delete: {
        title: 'Clear Chat History',
        message: 'Are you sure you want to clear all messages in this chat? This action cannot be undone.'
      }
    };

    setShowConfirmation({
      show: true,
      action,
      title: confirmationMessages[action].title,
      message: confirmationMessages[action].message
    });
    setShowDropdown(false);
  };

  const handleConfirmAction = () => {
    if (selectedChat && showConfirmation.action) {
      if (showConfirmation.action === 'delete') {
        // Just clear the messages for delete action
        setMessages([]);
      }
      // Call the remove handler (which will handle the action appropriately)
      onRemoveChat(selectedChat.id, showConfirmation.action);
      setShowConfirmation({ show: false, action: null, title: '', message: '' });
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-screen w-full">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white">
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Full size preview"
            className="max-h-[70vh] max-w-[70vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {showConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-black mb-2">
              {showConfirmation.title}
            </h3>
            <p className="text-black mb-6">
              {showConfirmation.message}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation({ show: false, action: null, title: '', message: '' })}
                className="px-4 py-2 text-black bg-white hover:bg-gray-50 rounded-lg text-sm border border-gray-300"
                style={{ backgroundColor: 'white' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-50 text-sm border border-gray-300"
                style={{ backgroundColor: 'white' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={selectedChat.avatar}
              alt={`${selectedChat.name}'s avatar`}
              className="w-14 h-14 rounded-full object-cover"
            />
            {selectedChat.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="ml-4">
            <h2 className="font-semibold text-gray-900 text-xl">{selectedChat.name}</h2>
            <p className="text-sm text-gray-500">
              {selectedChat.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center relative" ref={dropdownRef}>
          <button 
            className="p-2 bg-white hover:bg-gray-50 rounded-full border border-gray-300" 
            style={{ backgroundColor: 'white' }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <MoreVertical className="w-5 h-5 text-[#DD8560]" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <button
                onClick={() => handleRemoveAction('unmatch')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm bg-white"
                style={{ backgroundColor: 'white' }}
              >
                Unmatch
              </button>
              <button
                onClick={() => handleRemoveAction('unmatch_and_report')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm border-t border-gray-200 bg-white"
                style={{ backgroundColor: 'white' }}
              >
                Unmatch & Report
              </button>
              <button
                onClick={() => handleRemoveAction('delete')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm border-t border-gray-200 bg-white"
                style={{ backgroundColor: 'white' }}
              >
                Clear Chat History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 min-h-[calc(100vh-100px)]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[60%] ${
                message.senderId === currentUserId
                  ? 'bg-[#DD8560] text-white rounded-l-lg rounded-tr-lg'
                  : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
              } p-4`}
            >
              {message.type === 'text' ? (
                <p className="text-base">{message.content}</p>
              ) : message.type === 'image' ? (
                <div className="space-y-2">
                  <div 
                    className="w-[200px] h-[150px] overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(message.content)}
                  >
                    <img 
                      src={message.content}
                      alt={message.fileName}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <a 
                    href={message.content}
                    download={message.fileName}
                    className="text-sm hover:underline block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download {message.fileName}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Paperclip className="w-5 h-5 text-[#DD8560]" />
                  <a 
                    href={message.content}
                    download={message.fileName}
                    className="text-base underline hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {message.fileName}
                  </a>
                </div>
              )}
              <p className="text-xs mt-2 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="px-8 py-6 border-t sticky bottom-0 bg-white">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-3 bg-DD8560 hover:bg-gray-50 rounded-lg border border-gray-300 text-[#DD8560]"
            style={{ backgroundColor: 'white' }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            id="file-input"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD8560] text-gray-900 text-base min-w-[400px]"
          />
          <button
            type="submit"
            className="p-3 bg-white hover:bg-gray-50 rounded-lg border border-[#DD8560] text-[#DD8560] transition-colors"
            style={{ backgroundColor: 'white' }}
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
