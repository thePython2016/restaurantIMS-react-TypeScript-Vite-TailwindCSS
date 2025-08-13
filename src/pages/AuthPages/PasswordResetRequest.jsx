import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Multilingual from "../Forms/multilingual.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      console.log(`Attempting to call: ${API_BASE_URL}/auth/users/reset_password/`);
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/users/reset_password/`,
        { email: email.toLowerCase().trim() },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      // Handle both 200 and 204 status codes as success
      if (response.status === 200 || response.status === 204) {
        setMessage("✅ Password reset request sent successfully! Check your console for the reset URL.");
        setEmail("");
      } else {
        setError("❌ Unexpected response from server.");
      }
      
    } catch (err) {
      console.error("Password reset error:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError("❌ Cannot connect to server. Please check if the backend is running.");
      } else if (err.response?.status === 404) {
        setError("❌ Password reset endpoint not found. This feature may not be implemented yet.");
      } else if (err.response?.status === 204) {
        // 204 No Content - this might be a successful response without content
        setMessage("✅ Password reset request sent successfully! Check your console for the reset URL.");
      } else if (err.response?.status === 400) {
        setError("❌ Please enter a valid email address.");
      } else if (err.response?.status === 500) {
        setError("❌ Server error. Check email configuration.");
      } else if (err.response?.status === 405) {
        setError("❌ Method not allowed. Please contact support.");
      } else {
        setError(`❌ Failed to send reset email: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 relative">
      {/* Multilingual Component - Always visible at top center of left section */}
      <div className="fixed top-8 left-1/4 transform -translate-x-1/2 z-50 pointer-events-auto">
        <Multilingual />
      </div>
      <div className="relative w-full max-w-2xl mt-5 sm:pt-10">
        <div className="bg-white rounded-lg shadow p-8 w-full border-2 border-gray-200 min-h-[600px] overflow-visible">
          {/* Form Header - Always visible and fixed at top */}
          <div className="mb-6 sticky top-0 bg-white z-20 pb-4 border-b border-gray-100 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-1 text-sm text-gray-600">Enter your email to receive a password reset link</p>
          </div>

          {message && (
            <div className="mt-4 p-4 text-sm text-green-800 bg-green-100 border border-green-200 rounded-md relative">
              {/* Close button */}
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
          
          {error && (
            <div className="mt-4 p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md relative">
              {/* Close button */}
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

          <form className="space-y-4 mt-6 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/welcome" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
