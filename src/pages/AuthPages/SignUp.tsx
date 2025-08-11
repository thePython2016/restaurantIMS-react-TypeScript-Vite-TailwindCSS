import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

export function SignupForm() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const success = await googleLogin(tokenResponse.access_token);
        if (success) {
          setGoogleSignedIn(true);
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Google login error:", error);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
    },
    scope: "email profile",
    flow: "implicit",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!firstName.trim()) {
      setSubmitError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setSubmitError("Last name is required");
      return;
    }
    if (!email.trim()) {
      setSubmitError("Email is required");
      return;
    }
    if (!password.trim()) {
      setSubmitError("Password is required");
      return;
    }
    if (password.length < 8) {
      setSubmitError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const derivedUsername = email.includes("@") ? email.split("@")[0] : email;
      const response = await fetch("http://127.0.0.1:8000/auth/registration/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: derivedUsername,
          email,
          password1: password,
          password2: password,
        }),
      });
      if (!response.ok) {
        let message = "Registration failed";
        try {
          const err = await response.json();
          if (typeof err === "object" && err !== null) {
            const parts: string[] = [];
            Object.entries(err).forEach(([key, val]) => {
              if (Array.isArray(val)) {
                parts.push(`${key}: ${val.join(", ")}`);
              } else if (typeof val === "string") {
                parts.push(`${key}: ${val}`);
              }
            });
            if (parts.length) message = parts.join(" | ");
          }
        } catch {}
        throw new Error(message);
      }
      setSignupSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // No width or height restrictions here; page container controls size
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="relative w-full max-w-2xl mt-32">
      <h1 className="text-2xl font-extrabold text-center absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-4 z-10">RIMS</h1>
      <div className="bg-white rounded-lg shadow p-8 w-full border-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
      <p className="mt-1 text-sm text-gray-600">Enter your details to create an account!</p>

      {googleSignedIn && (
        <div className="mt-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md px-4 py-2">
          Google sign-in successful. You're logged in.
        </div>
      )}

      {submitError && (
        <div className="mt-4 p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
          <div className="flex items-center">
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
            <span className="font-semibold">Registration Error</span>
          </div>
          <p className="mt-1">{submitError}</p>
        </div>
      )}

      {signupSuccess && (
        <div className="mt-4 p-4 text-sm text-green-800 bg-green-100 border border-green-200 rounded-md">
          <div className="flex items-center mb-2">
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
            <span className="font-semibold">Account Created Successfully!</span>
          </div>
          <p className="mb-3">
            Your account has been created. You can now sign in with your email and
            password.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In Now
            </Link>
            <button
              onClick={() => {
                setSignupSuccess(false);
                setEmail("");
                setPassword("");
                setFirstName("");
                setLastName("");
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Create Another Account
            </button>
          </div>
        </div>
      )}

      <form className="space-y-4 mt-6 w-full" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" />
          <span>
            By creating an account you agree to our{" "}
            <a href="#" className="text-blue-600 underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>
          </span>
        </div>

        {submitError && (
          <div className="text-sm text-red-700 bg-red-100 border border-red-200 rounded-md px-3 py-2">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          disabled={googleSignedIn}
          className={`w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-gray-50 shadow-sm hover:shadow-md ${
            googleSignedIn ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <img src="https://img.icons8.com/color/16/google-logo.png" alt="Google" />
          {googleSignedIn ? "Signed in with Google" : "Continue with Google"}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/welcome" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
      </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return <SignupForm />;
}
