// src/pages/AuthPages/SignIn.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import Multilingual from "../Forms/multilingual.jsx";
import { useTranslation } from "react-i18next";
import WhatsAppButtonOut from "../Forms/WhatsAppButtonOut";

import {
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";

function SignIn() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeepLoggedIn(e.target.checked);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const success = await googleLogin(tokenResponse.access_token);
        if (success) {
          setGoogleSignedIn(true);
          setToast({ message: "Google sign-in successful!", type: "success" });
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } catch (error) {
        console.error("Google login error:", error);
        setToast({ message: "Google sign-in failed", type: "error" });
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setToast({ message: "Google sign-in failed", type: "error" });
    },
    scope: "email profile",
    flow: "implicit",
  });

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 relative pt-8">
      <div className="fixed top-8 left-1/4 transform -translate-x-1/2 z-50 pointer-events-auto">
        <Multilingual />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow p-8 w-full border-2 border-gray-200 min-h-[600px] overflow-visible">
          {/* Form Header */}
          <div className="mb-6 sticky top-0 bg-white z-20 pb-4 border-b border-gray-100 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">{t('sign_in')}</h2>
            <p className="mt-1 text-sm text-gray-600">{t('sign_in_description')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <Stack spacing={3}>
              <TextField
                label={t('email')}
                variant="outlined"
                fullWidth
                size="small"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
              />

              <TextField
                label={t('password')}
                variant="outlined"
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                InputLabelProps={{ sx: { "& .MuiFormLabel-asterisk": { color: "red" } } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? "🙈" : "👁"}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            {/* Keep logged in & forgot password */}
            <div className="flex items-center justify-between mt-3 mb-4">
              <FormControlLabel
                control={<Checkbox checked={keepLoggedIn} onChange={handleCheckboxChange} />}
                label={t('keep_logged_in')}
              />

              <button
                type="button"
                onClick={() => navigate("/password-reset")}
                className="text-sm text-blue-600 hover:underline"
              >
                {t('forgot_password')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-4 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? t('signing_in') : t('sign_in')}
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500 text-sm">{t('or')}</span>
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
              {googleSignedIn ? t("Signed in with Google") : t("Continue with Google")}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              {t('dont_have_account')}{" "}
              <button
                type="button"
                onClick={() => navigate("/signup-form")}
                className="text-blue-600 hover:underline"
              >
                {t('sign_up')}
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
      </div>

      {/* WhatsApp Button at bottom left */}
      <WhatsAppButtonOut />
    </div>
  );
}

export default SignIn;
