import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  barangay: string;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const STORAGE_KEY = 'digibaryo_users';
const CURRENT_USER_KEY = 'digibaryo_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load current user from localStorage
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Get users from localStorage
    const usersData = localStorage.getItem(STORAGE_KEY);
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Find user
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      saveUser(userWithoutPassword);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Get existing users
    const usersData = localStorage.getItem(STORAGE_KEY);
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Check if email exists
    const emailExists = users.some((u: any) => u.email === userData.email);
    if (emailExists) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // Login user
    const { password: _, ...userWithoutPassword } = newUser;
    saveUser(userWithoutPassword);
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    saveUser(updatedUser);
    
    // Update in users array
    const usersData = localStorage.getItem(STORAGE_KEY);
    const users = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};