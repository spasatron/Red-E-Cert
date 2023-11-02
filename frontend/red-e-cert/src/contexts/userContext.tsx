import { createContext, useContext, useState, ReactNode } from "react";

// Define a type for the user data
interface User {
  // Define the structure of your user data
  // For example:
  name: string;
  email: string;
  // Add other properties as needed
}

// Create a type for the context
interface UserContextType {
  user: User | null;
  updateUser: (newUser: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
