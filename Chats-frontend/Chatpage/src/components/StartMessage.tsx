import React from 'react';

const StartMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="text-center p-8 rounded-lg scale-75 w-140 max-w-screen-sm">
        <h1 className="text-xs font-medium text-black mb-4">Welcome to Chat</h1>
        <p className="text-[20px] text-gray-600 mb-4">Select a conversation to start messaging</p>
        <div className="w-16 h-16 mx-auto mb-4">
          <svg
            className="w-full h-full text-[#DD8560]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StartMessage;
