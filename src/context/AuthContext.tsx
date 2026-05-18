// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string, keepLoggedIn: boolean) => Promise<boolean>;
  googleLogin: (accessToken: string) => Promise<boolean>;
  logout: () => void;
  checkTokenExpiration: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load token from either localStorage or sessionStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    
    if (storedToken) {
      // Check if token is expired before setting it
      if (isTokenExpired(storedToken)) {
        console.log('Stored token is expired, logging out...');
        handleTokenExpiration();
        return;
      }
      
      setAccessToken(storedToken);
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          setUser({}); // fallback placeholder user
        }
      } else {
        setUser({}); // optional placeholder user
      }
    }
    
    // Mark loading as complete
    setIsLoading(false);
  }, []);

  // ✅ Periodic token expiration check (every 5 minutes)
  useEffect(() => {
    if (!accessToken) return;

    const checkTokenInterval = setInterval(() => {
      if (accessToken && isTokenExpired(accessToken)) {
        console.log('Token expired during session, logging out...');
        handleTokenExpiration();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkTokenInterval);
  }, [accessToken]);

  // ✅ Global fetch interceptor to catch 401 responses
  useEffect(() => {
    if (!accessToken) return;

    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);
        
        if (response.status === 401) {
          console.log('Global fetch interceptor caught 401 response');
          if (accessToken && isTokenExpired(accessToken)) {
            handleTokenExpiration();
            return response;
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [accessToken]);

  // ✅ Check if JWT token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = 5 * 60;
      return payload.exp < (currentTime + bufferTime);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // ✅ Handle token expiration
  const handleTokenExpiration = () => {
    console.log('Token expired, redirecting to welcome page...');
    setUser(null);
    setAccessToken(null);
    setIsLoading(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    window.location.href = "/welcome";
  };

  const login = async (
    usernameOrEmail: string,
    password: string,
    keepLoggedIn: boolean
  ): Promise<boolean> => {
    try {
      const derivedUsername = usernameOrEmail?.includes('@')
        ? usernameOrEmail.split('@')[0]
        : usernameOrEmail;

      let response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: derivedUsername, password }),
      });

      if (!response.ok && usernameOrEmail?.includes('@')) {
        console.log('First attempt failed, trying with email directly...');
        response = await fetch(`${API_URL}/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: usernameOrEmail, password }),
        });
      }

      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          console.log('Login error response:', errorData);
          errorMessage = errorData.message || errorData.detail || errorData.error || "Login failed";
        } catch (parseError) {
          console.log('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login response data:', data);
      const token = data.access;

      const userPayload =
        data.user ||
        (usernameOrEmail.includes("@") ? { email: usernameOrEmail } : {});

      if (keepLoggedIn) {
        localStorage.setItem("access_token", token);
        if (Object.keys(userPayload).length) {
          localStorage.setItem("user", JSON.stringify(userPayload));
        }
      } else {
        sessionStorage.setItem("access_token", token);
        if (Object.keys(userPayload).length) {
          sessionStorage.setItem("user", JSON.stringify(userPayload));
        }
      }

      setAccessToken(token);
      setUser(userPayload);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ✅ Google OAuth login function
  const googleLogin = async (googleAccessToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/google/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          access_token: googleAccessToken,
          token_type: "Bearer"
        }),
      });

      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = "Google login failed";
        try {
          const errorData = await response.json();
          console.log('Backend error data:', errorData);
          errorMessage = errorData.message || errorData.detail || errorData.error || "Google login failed";
        } catch (parseError) {
          console.log('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Backend success data:', data);
      
      const token = data.access_token || data.access || data.token;
      
      if (token) {
        localStorage.setItem("access_token", token);
        
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else if (data.email) {
          const userData = { email: data.email };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
        
        setAccessToken(token);
        return true;
      }
      
      throw new Error("No access token received from server");
    } catch (error: any) {
      console.error("Google login error:", error);
      const message =
        error?.message === "Failed to fetch"
          ? "Cannot reach the backend server."
          : error.message || "Google login failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsLoading(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    window.location.href = "/welcome";
  };

  // ✅ Public function to check token expiration (can be called from other components)
  const checkTokenExpiration = () => {
    if (accessToken && isTokenExpired(accessToken)) {
      handleTokenExpiration();
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, googleLogin, logout, checkTokenExpiration }}>
      {children}
    </AuthContext.Provider>
  );
};