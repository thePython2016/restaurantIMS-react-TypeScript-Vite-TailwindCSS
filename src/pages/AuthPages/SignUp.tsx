// src/pages/AuthPages/SignupForm.tsx
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

  // Google Login Logic
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
    setIsSubmitting(true);
    try {
      const derivedUsername = email?.includes('@') ? email.split('@')[0] : email;
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
          if (typeof err === 'object' && err !== null) {
            // Collect common allauth/dj-rest-auth errors
            const parts: string[] = [];
            Object.entries(err).forEach(([key, val]) => {
              if (Array.isArray(val)) {
                parts.push(`${key}: ${val.join(', ')}`);
              } else if (typeof val === 'string') {
                parts.push(`${key}: ${val}`);
              }
            });
            if (parts.length) message = parts.join(' | ');
          }
        } catch {}
        throw new Error(message);
      }
      // Show success banner with link to Welcome page
      setSignupSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f6]">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter your details to create an account!
        </p>

        {googleSignedIn && (
          <div className="mt-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md px-4 py-2">
            Google sign-in successful. You're logged in.
          </div>
        )}

        {signupSuccess && (
          <div className="mt-4 text-sm text-green-800 bg-green-100 border border-green-200 rounded-md px-4 py-2">
            Account created successfully.
            <span className="ml-1">Click</span>
            <Link to="/welcome" className="ml-1 font-semibold underline">here</Link>
            <span className="ml-1">to proceed to the Welcome page.</span>
          </div>
        )}

        {/* Form Fields */}
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Terms Checkbox */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={googleSignedIn}
            className={`w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-gray-50 shadow-sm hover:shadow-md ${googleSignedIn ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <img
              src="https://img.icons8.com/color/16/google-logo.png"
              alt="Google"
            />
            {googleSignedIn ? 'Signed in with Google' : 'Continue with Google'}
          </button>

          {/* Sign In Link */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/welcome" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignUp() {
  return <SignupForm />;
}
