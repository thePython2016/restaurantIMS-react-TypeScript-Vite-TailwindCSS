import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call (replace with real backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // YOUR CUSTOM CREDENTIALS - Replace these with your own
      const validCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'user', password: 'password123' },
        // Add more users here if needed
        // { username: 'yourname', password: 'yourpassword' },
      ];
      
      // Check if provided credentials match
      const isValidUser = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );
      
      if (isValidUser) {
        const mockUser: User = {
          id: '1',
          username: username,
          email: `${username}@example.com`,
          role: 'user'
        };
        
        // Store user data
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      } else {
        return false; // Invalid credentials
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a new user
      const newUser: User = {
        id: Date.now().toString(),
        username: username,
        email: email,
        role: 'user'
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 