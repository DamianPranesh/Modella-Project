import { format } from "date-fns";




// Define the Chat interface to type the chat objects
interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  avatar: string;
  unreadCount: number;
  isOnline: boolean;
}

// Define the ChatListProps interface to type the props for the ChatList component
interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
}

// Define the ChatList component
export function ChatList({
  chats,
  onChatSelect,
  selectedChatId,
}: ChatListProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header section with title */}
      <div className="p-7 pt-11 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-[#DD8560] font-['Junge']">
            Messages
          </h2>
        </div>
      </div>
      

      {/* Chat list container with custom scrollbar styles */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
        }}
      >
        {/* Map through the chats array and render each chat item */}
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 pl-4 cursor-pointer hover:bg-gray-50 transition-colors border border-gray-300 rounded-lg mx-4 my-1 ${
              selectedChatId === chat.id ? "bg-gray-100" : ""
            }`}
            onClick={() => onChatSelect(chat.id)}
          >
            {/* Chat avatar and online status indicator */}
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

            {/* Chat details including name, timestamp, last message, and unread count */}
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