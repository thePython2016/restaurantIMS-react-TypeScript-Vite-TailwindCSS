// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";

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

    // Store original fetch
    const originalFetch = window.fetch;

    // Override fetch to intercept 401 responses
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);
        
        // Check for 401 Unauthorized response
        if (response.status === 401) {
          console.log('Global fetch interceptor caught 401 response');
          // Check if token is actually expired
          if (accessToken && isTokenExpired(accessToken)) {
            handleTokenExpiration();
            return response; // Return response but redirect will happen
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    // Cleanup: restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, [accessToken]);

  // ✅ Check if JWT token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      // Decode JWT token (without verification - just for expiration check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token has expired (with 5 minute buffer)
      const bufferTime = 5 * 60; // 5 minutes in seconds
      return payload.exp < (currentTime + bufferTime);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // If we can't decode, assume expired
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
    
    // Redirect to welcome page
    window.location.href = "/welcome";
  };

  const login = async (
    usernameOrEmail: string,
    password: string,
    keepLoggedIn: boolean
  ): Promise<boolean> => {
    try {
      // SimpleJWT default expects the Django username field. Our signup uses the email prefix as username.
      const derivedUsername = usernameOrEmail?.includes('@')
        ? usernameOrEmail.split('@')[0]
        : usernameOrEmail;

      // First try with derived username
      let response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: derivedUsername, password }),
      });

      // If that fails and the input looks like an email, try with the email directly
      if (!response.ok && usernameOrEmail?.includes('@')) {
        console.log('First attempt failed, trying with email directly...');
        response = await fetch("http://127.0.0.1:8000/login/", {
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

      // ✅ Store token based on keepLoggedIn
      if (keepLoggedIn) {
        localStorage.setItem("access_token", token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } else {
        sessionStorage.setItem("access_token", token);
        if (data.user) {
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      setAccessToken(token);
      setUser(data.user || { username: derivedUsername }); // use response user data or fallback

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ✅ Google OAuth login function
  const googleLogin = async (googleAccessToken: string): Promise<boolean> => {
    try {
      console.log('Sending Google token to backend:', googleAccessToken);
      
      const response = await fetch("http://127.0.0.1:8000/auth/google/", {
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
      
      // Handle different response formats
      const token = data.access_token || data.access || data.token;
      
      if (token) {
        // Always store Google login in localStorage (keep logged in by default)
        localStorage.setItem("access_token", token);
        
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else if (data.username) {
          // If backend returns username instead of full user object
          const userData = { username: data.username, email: data.email };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
        
        setAccessToken(token);
        return true;
      }
      
      throw new Error("No access token received from server");
    } catch (error: any) {
      console.error("Google login error:", error);
      throw new Error(error.message || "Google login failed");
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
    
    // Redirect to welcome page after logout
    window.location.href = "/welcome";
  };

  // ✅ Public function to check token expiration (can be called from other components)
  const checkTokenExpiration = () => {
    if (accessToken && isTokenExpired(accessToken)) {
      handleTokenExpiration();
      return true; // Token is expired
    }
    return false; // Token is valid
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, googleLogin, logout, checkTokenExpiration }}>
      {children}
    </AuthContext.Provider>
  );
};