import React from 'react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: string;
  sender: string;
  created_at: string;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, created_at, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-[rgb(221,133,96)] text-white' 
            : 'bg-[#2d2d2d] text-white'
        }`}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{sender}</span>
          <span className="text-xs text-gray-300">
            {format(new Date(created_at), 'HH:mm')}
          </span>
        </div>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
};

//changes to be made.