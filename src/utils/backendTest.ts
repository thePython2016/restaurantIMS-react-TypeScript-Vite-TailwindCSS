// Utility function to test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connectivity
    const response = await fetch('http://127.0.0.1:8000/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.text();
      console.log('Backend response data:', data);
    }
    
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// Test Google OAuth endpoint specifically
export const testGoogleOAuthEndpoint = async (mockToken: string = 'test_token') => {
  try {
    console.log('Testing Google OAuth endpoint...');
    
    const response = await fetch('http://127.0.0.1:8000/auth/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: mockToken,
        token_type: 'Bearer'
      }),
    });
    
    console.log('Google OAuth endpoint status:', response.status);
    console.log('Google OAuth endpoint headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Google OAuth success response:', data);
    } else {
      const errorData = await response.text();
      console.log('Google OAuth error response:', errorData);
    }
    
    return response.status;
  } catch (error) {
    console.error('Google OAuth endpoint test failed:', error);
    return null;
  }
}; 