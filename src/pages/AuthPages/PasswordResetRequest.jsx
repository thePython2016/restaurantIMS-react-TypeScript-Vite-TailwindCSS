import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-gray-600 mt-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default PasswordResetRequest;
