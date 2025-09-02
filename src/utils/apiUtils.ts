import { useAuth } from '../context/AuthContext';

// Global fetch wrapper that automatically handles token expiration
export const createAuthenticatedFetch = (checkTokenExpiration: () => boolean) => {
  return async (url: string, options: RequestInit = {}) => {
    // Check if token is expired before making the request
    if (checkTokenExpiration()) {
      // Token is expired, redirect will happen automatically
      throw new Error('Token expired');
    }

    try {
      const response = await fetch(url, options);
      
      // Check if response indicates token expiration (401 Unauthorized)
      if (response.status === 401) {
        console.log('API returned 401, token may be expired');
        checkTokenExpiration(); // This will redirect to welcome page if expired
        throw new Error('Unauthorized - token expired');
      }
      
      return response;
    } catch (error) {
      // Re-throw the error for the calling component to handle
      throw error;
    }
  };
};

// Utility to check if an error is due to token expiration
export const isTokenExpirationError = (error: any): boolean => {
  return error?.message?.includes('Token expired') || 
         error?.message?.includes('Unauthorized') ||
         error?.status === 401;
};




