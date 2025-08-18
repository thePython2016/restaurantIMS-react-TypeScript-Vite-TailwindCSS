import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Stack,
} from "@mui/material";

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

  const handleResend = () => {
    if (resendCooldown === 0) {
      // Reset the emailSent state to show the form again temporarily
      setEmailSent(false);
      // Create a proper form event for handleSubmit
      const syntheticEvent = {
        preventDefault: () => {},
        target: { email: { value: email } }
      };
      handleSubmit(syntheticEvent);
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

          {/* Success Message */}
          {message && (
            <div className="mt-4 p-4 text-sm text-green-800 bg-green-100 border border-green-200 rounded-md relative">
              <button
                onClick={() => setMessage("")}
                className="absolute top-2 right-2 text-green-600 hover:text-green-800 transition-colors"
                aria-label="Close success message"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              <div className="flex items-center mb-2 pr-6">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Success!</span>
              </div>
              <p className="pr-6">{message}</p>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md relative">
              <button
                onClick={() => setError("")}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
                aria-label="Close error message"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              <div className="flex items-center pr-6">
                <svg
                  className="w-5 h-5 mr-2 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Error</span>
              </div>
              <p className="mt-1 pr-6">{error}</p>
            </div>
          )}

          {/* Email Sent Success State */}
          {emailSent && !error ? (
            <div className="text-center space-y-6 mt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Check Your Email</h3>
                <p className="text-green-700 mb-4">
                  We've sent a password reset link to your email address. The link will expire in 24 hours.
                </p>
                <div className="text-sm text-green-600 space-y-1">
                  <p>• Check your spam/junk folder if you don't see the email</p>
                  <p>• The email may take a few minutes to arrive</p>
                  <p>• Make sure you entered the correct email address</p>
                </div>
              </div>

              {/* Resend Option */}
              <div className="pt-4">
                <p className="text-gray-600 mb-3">Didn't receive the email?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold flex items-center justify-center mx-auto ${
                    resendCooldown > 0 || loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    'Resend Email'
                  )}
                </button>
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
                  error={error && error.includes('email')}
                  helperText={error && error.includes('email') ? error.replace('❌ ', '') : ''}
                  InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
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

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            <button
              type="button"
              onClick={() => navigate("/welcome")}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;