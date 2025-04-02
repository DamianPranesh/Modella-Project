// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for the context
interface UserContextType {
  userId: string | null;
  setUserId: (userId: string) => void; // This can still be useful if you decide to update the userId later
}

// Create the context with a default value of undefined
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
  // Hardcoding the userId here
  const [userId, setUserId] = useState<string | null>(
    "brand_67c5b2c43ae5b4ccb85b9a11"
  ); // Hardcoded userId

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
