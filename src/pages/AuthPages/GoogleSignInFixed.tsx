import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleSignInFixed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Google Login Logic with Authorization Code Flow
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        console.log('Google login successful, token received');
        const res = await axios.post("http://localhost:8000/auth/google/", {
          access_token: tokenResponse.access_token,
        });

        if (res.data.access_token) {
          // Store the token in localStorage
          localStorage.setItem('access_token', res.data.access_token);
          if (res.data.refresh_token) {
            localStorage.setItem('refresh_token', res.data.refresh_token);
          }
          
          setToast({ message: "Google login successful!", type: "success" });
          setTimeout(() => navigate("/dashboard"), 2500);
        } else {
          setToast({ message: "Login successful but no token received", type: "error" });
        }
      } catch (error: any) {
        console.error("Google login error", error);
        setToast({ 
          message: error.response?.data?.message || "Google login failed", 
          type: "error" 
        });
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setToast({ 
        message: "Google login was cancelled or failed. Please try again.", 
        type: "error" 
      });
      setLoading(false);
    },
    scope: 'email profile openid',
    flow: 'auth-code' // Using authorization code flow instead of implicit
  });

  return (
    <div className="w-full">
      <button
        onClick={() => handleGoogleLogin()}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {loading ? "Signing in..." : "Continue with Google"}
      </button>

      {/* Toast Notification */}
      {toast && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          toast.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
} 