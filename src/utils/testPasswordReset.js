import axios from "axios";

export const testPasswordResetEndpoint = async (email) => {
  try {
    console.log("Testing password reset endpoint...");
    
    // Test 1: Check if server is reachable
    const healthCheck = await axios.get("http://127.0.0.1:8000/admin/");
    console.log("✅ Django server is running");
    
    // Test 2: Try the password reset endpoint
    const response = await axios.post("http://127.0.0.1:8000/auth/password/reset/", {
      email: email
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("✅ Password reset endpoint working:", response.data);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error("❌ Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    if (error.code === 'ECONNREFUSED') {
      return { 
        success: false, 
        error: 'Django server is not running. Please start it with: python manage.py runserver' 
      };
    }
    
    if (error.response?.status === 403) {
      return { 
        success: false, 
        error: 'CORS error - Django is not configured to accept requests from React' 
      };
    }
    
    if (error.response?.status === 500) {
      return { 
        success: false, 
        error: 'Server error - Check Django console for email configuration issues' 
      };
    }
    
    // Check for email-specific errors
    if (error.response?.data?.email) {
      return { 
        success: false, 
        error: `Email error: ${error.response.data.email.join(', ')}` 
      };
    }
    
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
}; 