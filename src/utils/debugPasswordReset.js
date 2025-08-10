import axios from "axios";

/**
 * Debug function to test password reset endpoint
 * Call this from browser console: window.debugPasswordReset('test@example.com')
 */
export const debugPasswordReset = async (email = 'test@example.com') => {
  console.log('🔍 Starting password reset debug...');
  
  try {
    // Step 1: Test server connectivity
    console.log('1️⃣ Testing server connectivity...');
    try {
      const healthCheck = await axios.get("http://127.0.0.1:8000/admin/", { timeout: 5000 });
      console.log('✅ Django server is running');
    } catch (healthError) {
      console.error('❌ Django server is not accessible:', healthError.message);
      if (healthError.code === 'ECONNREFUSED') {
        console.log('💡 Solution: Start Django server with: python manage.py runserver 127.0.0.1:8000');
        return { success: false, error: 'Django server not running' };
      }
    }

    // Step 2: Test password reset endpoint
    console.log('2️⃣ Testing password reset endpoint...');
    const response = await axios.post("http://127.0.0.1:8000/auth/password/reset/", {
      email: email,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    console.log('✅ Password reset request successful!');
    console.log('📧 Response:', response.data);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    
    // Detailed error analysis
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Django server is not running. Start it with:');
      console.log('   cd djangoPro/myproject && python manage.py runserver 127.0.0.1:8000');
      return { success: false, error: 'Connection refused - Django server not running' };
    }
    
    if (error.response?.status === 403) {
      console.log('💡 CORS error. Check these settings in Django:');
      console.log('   - CORS_ALLOWED_ORIGINS should include your React app URL');
      console.log('   - Current React app URL:', window.location.origin);
      return { success: false, error: 'CORS error - Access denied' };
    }
    
    if (error.response?.status === 404) {
      console.log('💡 Endpoint not found. Check if djoser is properly configured in Django URLs');
      return { success: false, error: 'API endpoint not found' };
    }
    
    if (error.response?.status === 500) {
      console.log('💡 Server error. Common causes:');
      console.log('   - Email backend not configured properly in Django settings');
      console.log('   - Database migration needed');
      console.log('   - Check Django console for detailed error');
      return { success: false, error: 'Internal server error' };
    }
    
    if (error.response?.data) {
      console.log('📋 Server error details:', error.response.data);
      return { success: false, error: error.response.data };
    }
    
    return { success: false, error: error.message };
  }
};

// Make it available globally for console debugging
if (typeof window !== 'undefined') {
  window.debugPasswordReset = debugPasswordReset;
}

