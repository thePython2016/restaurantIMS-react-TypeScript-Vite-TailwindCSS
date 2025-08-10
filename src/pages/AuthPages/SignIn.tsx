// src/pages/AuthPages/SignIn.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import PasswordResetPage from "./PasswordResetRequest.jsx";

function SignIn() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeepLoggedIn(e.target.checked);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const success = await login(email, password, keepLoggedIn);
      if (success) {
        setToast({ message: "Login successful!", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setToast({ message: "Login failed", type: "error" });
      }
    } catch (error: any) {
      setToast({
        message: error.message || "Login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Login Logic
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google login successful, token received:", tokenResponse);
        setLoading(true);

        const success = await googleLogin(tokenResponse.access_token);

        if (success) {
          setToast({ message: "Google login successful!", type: "success" });
          setTimeout(() => navigate("/dashboard"), 1500);
        } else {
          setToast({ message: "Google login failed", type: "error" });
        }
      } catch (error: any) {
        console.error("Google login error:", error);
        setToast({
          message: error.message || "Google login failed",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setToast({
        message: "Google login was cancelled or failed. Please try again.",
        type: "error",
      });
    },
    scope: "email profile",
    flow: "implicit",
  });

  return (
    // Removed bg-gray-100 here
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <h1 className="text-3xl font-extrabold mb-8">RMIS</h1>
      <form
        onSubmit={handleSubmit}
        // Increased max width here
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-2">Sign In</h2>
        <p className="text-gray-500 mb-6">
          Enter your email and password to sign in!
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="info@gmail.com"
            className="w-full border border-gray-300 rounded-lg px-6 py-3 text-md"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-md"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              👁
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Keep me logged in
          </label>
          <button
            type="button"
            onClick={() => navigate("/password-reset")}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-4 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-gray-50 shadow-sm hover:shadow-md"
          >
            <img
              src="https://img.icons8.com/color/16/google-logo.png"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>

        {toast && (
          <div
            className={`text-sm mt-4 text-center px-4 py-2 rounded-md ${
              toast.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {toast.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default SignIn;
