import React from 'react';
import { Users } from "lucide-react";

const ChatlistSkeleton: React.FC = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Users className="w-6 h-6" />
        <h2 className="text-lg font-semibold">Contacts</h2>
      </div>

      {/* Skeleton Contacts */}
      <div>
        {skeletonContacts.map((_, idx) => (
          <div 
            key={idx} 
            className="flex items-center p-4 border-b animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
            
            {/* User info skeleton - only visible on larger screens */}
            <div className="flex-grow hidden md:block">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatlistSkeleton;