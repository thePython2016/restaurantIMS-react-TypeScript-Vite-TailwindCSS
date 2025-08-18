// src/services/authService.js

const API_BASE_URL = 'http://localhost:8000/api/auth';

class AuthService {
  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/reset_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { 
          success: true, 
          message: 'Password reset email sent! Please check your inbox.' 
        };
      } else {
        return { 
          success: false, 
          message: data.email ? data.email[0] : 'Error sending reset email' 
        };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        message: 'Network error occurred. Please try again.' 
      };
    }
  }

  // Confirm password reset
  async confirmPasswordReset({ uid, token, new_password, re_new_password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/reset_password_confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          new_password,
          re_new_password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { 
          success: true, 
          message: 'Password reset successful! You can now login with your new password.' 
        };
      } else {
        let errorMessage = 'Error resetting password';
        
        if (data.new_password) {
          errorMessage = Array.isArray(data.new_password) ? data.new_password[0] : data.new_password;
        } else if (data.token) {
          errorMessage = Array.isArray(data.token) ? data.token[0] : 'Invalid or expired reset link';
        } else if (data.uid) {
          errorMessage = 'Invalid reset link';
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        }
        
        return { 
          success: false, 
          message: errorMessage 
        };
      }
    } catch (error) {
      console.error('Password reset confirm error:', error);
      return { 
        success: false, 
        message: 'Network error occurred. Please try again.' 
      };
    }
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { 
        isValid: false, 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      };
    }
    
    return { isValid: true, message: '' };
  }

  // Get URL parameters (for uid and token)
  getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      uid: urlParams.get('uid'),
      token: urlParams.get('token')
    };
  }
}

export default new AuthService();