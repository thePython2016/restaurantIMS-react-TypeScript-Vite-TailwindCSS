import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!uid || !token) {
      setError("❌ Invalid reset link. Please request a new password reset.");
      return;
    }
    setIsValidToken(true);
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("❌ Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      console.log(`Attempting to reset password with uid: ${uid}`);
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/users/reset_password_confirm/`,
        {
          uid: uid,
          token: token,
          new_password: password
        },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error("Password reset confirmation error:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.error) {
          setError(`❌ ${errorData.error}`);
        } else {
          setError("❌ Invalid request. Please check your input.");
        }
      } else if (err.response?.status === 404) {
        setError("❌ Password reset endpoint not found.");
      } else if (err.response?.status === 500) {
        setError("❌ Server error. Please try again later.");
      } else {
        setError(`❌ Failed to reset password: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Invalid Reset Link</h2>
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          <Link to="/password-reset" className="text-blue-600 hover:underline">
            Request New Reset Link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
            minLength="8"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
            minLength="8"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
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

export default PasswordResetConfirm;
