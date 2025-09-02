import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import WhatsAppButtonOut from "../Forms/WhatsAppButtonOut";

// Using relative URLs for better deployment flexibility

const PasswordResetRequest = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Send password reset request
  const requestPasswordReset = async (email) => {
    try {
      // Try standard Djoser endpoint first
      let response = await fetch('http://localhost:8000/auth/users/reset_password/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      // If standard endpoint fails, try custom endpoint
      if (!response.ok && response.status === 404) {
        console.log('Standard endpoint failed, trying custom endpoint...');
        response = await fetch('http://localhost:8000/auth/custom-password-reset/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });
      }

      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  };

  // Start resend cooldown timer
  const startCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setError("❌ Please enter your email address.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("❌ Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      console.log(`Attempting password reset for: ${email.toLowerCase().trim()}`);
      
      const response = await requestPasswordReset(email.toLowerCase().trim());

      if (response.ok) {
        setMessage("✅ Password reset request sent successfully! Please check your email for the reset link. If you don't see it, check your spam folder.");
        setEmail("");
        setEmailSent(true);
        startCooldown();
      } else if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.email && Array.isArray(errorData.email)) {
          setError(`❌ ${errorData.email[0]}`);
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          setError(`❌ ${errorData.non_field_errors[0]}`);
        } else {
          setError("❌ Please enter a valid email address.");
        }
      } else if (response.status === 404) {
        const errorData = await response.json();
        if (errorData.error) {
          setError(`❌ ${errorData.error}`);
        } else {
          setError("❌ No account found with this email address.");
        }
      } else {
        setError("❌ Unexpected response from server.");
      }
      
    } catch (err) {
      console.error("Password reset error:", err);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("❌ Cannot connect to server. Please check if the backend is running.");
      } else if (err.message.includes('404')) {
        setError("❌ Password reset endpoint not found. This feature may not be implemented yet.");
      } else {
        setError(`❌ Failed to send reset email. Please try again later.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown === 0 && !loading) {
      setLoading(true);
      setError("");
      
      try {
        const response = await requestPasswordReset(email.toLowerCase().trim());
        
        if (response.ok) {
          setMessage("✅ Password reset request sent successfully! Please check your email for the reset link. If you don't see it, check your spam folder.");
          startCooldown();
        } else if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.email && Array.isArray(errorData.email)) {
            setError(`❌ ${errorData.email[0]}`);
          } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
            setError(`❌ ${errorData.non_field_errors[0]}`);
          } else {
            setError("❌ Please enter a valid email address.");
          }
        } else if (response.status === 404) {
          const errorData = await response.json();
          if (errorData.error) {
            setError(`❌ ${errorData.error}`);
          } else {
            setError("❌ No account found with this email address.");
          }
        } else {
          setError("❌ Unexpected response from server.");
        }
      } catch (err) {
        console.error("Password reset resend error:", err);
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError("❌ Cannot connect to server. Please check if the backend is running.");
        } else {
          setError(`❌ Failed to send reset email. Please try again later.`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 relative pt-8" style={{ fontFamily: '"Roboto", sans-serif' }}>
      {/* Multilingual Component Placeholder */}
      <div className="fixed top-8 left-1/4 transform -translate-x-1/2 z-50 pointer-events-auto">
        {/* <Multilingual /> - Add your component here */}
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow p-8 w-full border-2 border-gray-200 min-h-[600px] overflow-visible">
          
          {/* Form Header */}
          <div className="mb-6 sticky top-0 bg-white z-20 pb-4 border-b border-gray-100 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-1 text-sm text-gray-600">
              {emailSent 
                ? "We've sent a reset link to your email address"
                : "Enter your email to receive a password reset link"
              }
            </p>
          </div>



          {/* Email Sent Success State */}
          {emailSent && !error ? (
            <div className="text-center space-y-6 mt-8">
              {/* Clean Success Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                {/* Email Icon */}
                <div className="mb-6">
                  <svg className="w-20 h-20 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                </div>

                {/* Main Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h3>
                
                {/* Instruction Message */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Password reset request sent successfully! Please check your email for the reset link. If you don't see it, check your spam folder.
                </p>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => navigate("/welcome")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mb-4 transition-colors duration-200"
                >
                  Back to Login
                </button>

                {/* Secondary Action Button */}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className={`w-full border border-gray-300 bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg mb-2 transition-colors duration-200 ${
                    resendCooldown > 0 || loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {loading ? 'Sending...' : 'Resend Link'}
                </button>

                {/* Cooldown Timer */}
                {resendCooldown > 0 && (
                  <p className="text-sm text-gray-400">
                    Available in {resendCooldown} seconds
                  </p>
                )}


              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="mt-6 w-full">
              <Stack spacing={3}>
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="youremail@example.com"
                  error={error && error.includes('email')}
                  helperText={error && error.includes('email') ? error.replace('❌ ', '') : ''}
                  InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#D1D5DB',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9CA3AF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3B82F6',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon sx={{ color: '#9CA3AF', fontSize: '18px' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <button
                type="submit"
                disabled={loading || !email.trim() || !isValidEmail(email.trim())}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-4 ${
                  loading || !email.trim() || !isValidEmail(email.trim()) ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {/* Footer - Only show when form is visible, not in success state */}
          {!emailSent && (
            <p className="text-center text-sm text-gray-600 mt-6">
              <button
                type="button"
                onClick={() => navigate("/welcome")}
                className="text-blue-600 hover:underline font-medium"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>
      </div>

      {/* WhatsApp Button at bottom right */}
      <WhatsAppButtonOut />
    </div>
  );
};

export default PasswordResetRequest;