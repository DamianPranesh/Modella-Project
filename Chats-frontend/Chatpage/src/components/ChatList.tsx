import React from "react";
import { format } from "date-fns";
import { Bell } from "lucide-react";

// Add Junge font import
import "@fontsource/junge";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  avatar: string;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
}

export function ChatList({
  chats,
  onChatSelect,
  selectedChatId,
}: ChatListProps) {
  const handleNotificationClick = () => {
    // Handle notification click
    console.log("Notifications clicked");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-7 pt-11 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-[#DD8560] font-['Junge']">
            Messages
          </h2>
          <button
            onClick={handleNotificationClick}
            className="p-2 bg-white rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'white' }}
          >
            <Bell
              className="w-5 h-5 stroke-[#DD8560] fill-white"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
        }}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 pl-4 cursor-pointer hover:bg-gray-50 transition-colors border border-gray-300 rounded-lg mx-4 my-1 ${
              selectedChatId === chat.id ? "bg-gray-100" : ""
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="relative">
              <img
                src={chat.avatar}
                alt={`${chat.name}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {chat.name}
                </h3>
                <span className="text-[10px] text-gray-500">
                  {format(chat.timestamp, "HH:mm")}
                </span>
              </div>

              <div className="flex justify-between items-center mt-0.5">
                <p className="text-xs text-gray-600 truncate max-w-[280px]">
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-[#DD8560] text-white text-[10px] rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}