// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the types for the context
interface UserContextType {
  userId: string;
  setUserId: (userId: string) => void;
}

// Default hardcoded user ID as fallback
const DEFAULT_USER_ID = "brand_67f25df4de04fc160d150db1";

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialize with default user ID or from localStorage if available
  const [userId, setUserIdState] = useState<string>(() => {
    return localStorage.getItem("userId") || DEFAULT_USER_ID;
  });

  // Wrapper for setUserId that also updates localStorage
  const setUserId = (newUserId: string) => {
    console.log("Setting userId in context to:", newUserId);
    localStorage.setItem("userId", newUserId);
    setUserIdState(newUserId);
  };

  // Log when userId changes
  useEffect(() => {
    console.log("UserContext userId:", userId);
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};