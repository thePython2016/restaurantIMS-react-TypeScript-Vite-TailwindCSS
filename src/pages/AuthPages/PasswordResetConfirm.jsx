import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Stack,
} from "@mui/material";

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [resetSuccess, setResetSuccess] = useState(false);

  // Environment-based API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 
                       import.meta.env.VITE_BACKEND_URL || 
                       'http://localhost:8000';

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  useEffect(() => {
    if (!uid || !token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }
    setIsValidToken(true);
  }, [uid, token]);

  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    }
  }, [password]);

  const getPasswordStrengthColor = (score) => {
    if (score < 2) return 'text-red-600';
    if (score < 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPasswordStrengthText = (score) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("❌ Password must be at least 8 characters long.");
      return;
    }

    if (passwordStrength.score < 3) {
      setError("❌ Please choose a stronger password with the requirements listed below.");
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      console.log(`Attempting to reset password with uid: ${uid}`);
      
      const response = await fetch(`${API_BASE_URL}/auth/users/reset_password_confirm/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
          token: token,
          new_password: password,
          re_new_password: confirmPassword
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setResetSuccess(true);
        setTimeout(() => {
          navigate('/welcome');
        }, 3000);
      } else {
        let errorMessage = "❌ Failed to reset password. Please try again.";
        
        try {
          const errorData = await response.json();
          
          if (response.status === 400) {
            if (errorData.new_password && Array.isArray(errorData.new_password)) {
              errorMessage = `❌ ${errorData.new_password[0]}`;
            } else if (errorData.re_new_password && Array.isArray(errorData.re_new_password)) {
              errorMessage = `❌ ${errorData.re_new_password[0]}`;
            } else if (errorData.uid && Array.isArray(errorData.uid)) {
              errorMessage = "❌ Invalid or expired reset link. Please request a new one.";
            } else if (errorData.token && Array.isArray(errorData.token)) {
              errorMessage = "❌ Invalid or expired reset token. Please request a new reset link.";
            } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
              errorMessage = `❌ ${errorData.non_field_errors[0]}`;
            } else if (typeof errorData.error === 'string') {
              errorMessage = `❌ ${errorData.error}`;
            }
          } else if (response.status === 404) {
            errorMessage = "❌ Password reset endpoint not found. Please contact support.";
          } else if (response.status === 429) {
            errorMessage = "❌ Too many requests. Please wait before trying again.";
          } else if (response.status >= 500) {
            errorMessage = "❌ Server error. Please try again later.";
          }
        } catch (jsonError) {
          console.log('Could not parse error response as JSON');
        }
        
        setError(errorMessage);
      }
      
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Password reset confirmation error:", err);
      
      if (err.name === 'AbortError') {
        setError("❌ Request timeout. Please check your connection and try again.");
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("❌ Cannot connect to server. Please check if the backend is running.");
      } else {
        setError(`❌ ${err.message || "Failed to reset password. Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Invalid token state
  if (!isValidToken) {
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
              <h2 className="text-3xl font-bold text-gray-900">Invalid Reset Link</h2>
              <p className="mt-1 text-sm text-gray-600">
                The password reset link is invalid or has expired
              </p>
            </div>

            {/* Error Message */}
            <div className="mt-4 p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md relative">
              <div className="flex items-center pr-6">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Error</span>
              </div>
              <p className="mt-1 pr-6">{error}</p>
            </div>

            <div className="text-center space-y-6 mt-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold text-red-800 mb-2">Link Expired or Invalid</h3>
                <p className="text-red-700 mb-4">
                  This password reset link is no longer valid. Please request a new one.
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/password-reset")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Request New Reset Link
                </button>
                <button
                  onClick={() => navigate("/welcome")}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
            <p className="mt-1 text-sm text-gray-600">
              {resetSuccess 
                ? "Your password has been reset successfully"
                : "Enter your new password below"
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

          {/* Success State */}
          {resetSuccess && !error ? (
            <div className="text-center space-y-6 mt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Password Reset Complete!</h3>
                <p className="text-green-700 mb-4">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                <div className="text-sm text-green-600 space-y-1">
                  <p>• Redirecting you to the login page...</p>
                  <p>• Make sure to keep your password secure</p>
                </div>
              </div>

              {/* Dashboard Button */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/welcome")}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.2)'
                  }}
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="mt-6 w-full">
              <Stack spacing={3}>
                <div className="relative">
                  <TextField
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    error={password && passwordStrength.score < 3}
                    helperText={
                      password && passwordStrength.feedback.length > 0
                        ? `Missing: ${passwordStrength.feedback.join(', ')}`
                        : password
                        ? `Password strength: ${getPasswordStrengthText(passwordStrength.score)}`
                        : 'Minimum 8 characters with mixed case, numbers, and symbols'
                    }
                    InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {password && (
                    <div className={`mt-1 text-xs ${getPasswordStrengthColor(passwordStrength.score)}`}>
                      Password strength: {getPasswordStrengthText(passwordStrength.score)}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <TextField
                    label="Confirm New Password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    error={confirmPassword && password !== confirmPassword}
                    helperText={
                      confirmPassword && password !== confirmPassword
                        ? 'Passwords do not match'
                        : confirmPassword && password === confirmPassword
                        ? 'Passwords match'
                        : ''
                    }
                    InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </Stack>

              <button
                type="submit"
                disabled={
                  loading || 
                  !password || 
                  !confirmPassword || 
                  password !== confirmPassword ||
                  passwordStrength.score < 3
                }
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-4 ${
                  loading || 
                  !password || 
                  !confirmPassword || 
                  password !== confirmPassword ||
                  passwordStrength.score < 3 ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
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

export default PasswordResetConfirm;