import { useAuth } from '../context/AuthContext';

// Custom hook to automatically validate tokens on API calls
export const useTokenValidation = () => {
  const { checkTokenExpiration } = useAuth();

  // Wrapper for fetch that checks token expiration
  const fetchWithTokenValidation = async (url: string, options: RequestInit = {}) => {
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

  return { fetchWithTokenValidation, checkTokenExpiration };
};




