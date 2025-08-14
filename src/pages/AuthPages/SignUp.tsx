import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import Multilingual from "../Forms/multilingual.jsx";
import { useTranslation } from "react-i18next";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function SignupForm() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Debug effect to log fieldErrors changes
  useEffect(() => {
    console.log("fieldErrors changed:", fieldErrors);
  }, [fieldErrors]);
  
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const clearFormFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setSubmitError(null);
    setFieldErrors({});
  };

  // Clear field error when user starts typing
  const handleFieldChange = (field: string, value: string, setter: (value: string) => void) => {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    if (signupSuccess) {
      // Scroll to top to ensure success message is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [signupSuccess]);

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

  // Function to close success message
  const closeSuccessMessage = () => {
    setSignupSuccess(false);
  };

  // Function to navigate to login
  const goToLogin = () => {
    navigate("/welcome");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});
    setSignupSuccess(false);

    // Client-side validation
    const newFieldErrors: {[key: string]: string} = {};
    
    if (!firstName.trim()) newFieldErrors.firstName = t("First name is required");
    if (!lastName.trim()) newFieldErrors.lastName = t("Last name is required");
    if (!email.trim()) newFieldErrors.email = t("Email is required");
    if (!phone.trim()) newFieldErrors.phone = t("Phone number is required");
    if (!password.trim()) newFieldErrors.password = t("Password is required");
    if (password.length < 8) newFieldErrors.password = t("Password must be at least 8 characters long");
    if (password !== confirmPassword) newFieldErrors.confirmPassword = t("Passwords do not match");

    // Email format validation
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newFieldErrors.email = t("Please enter a valid email address");
    }

    // Phone number format validation (basic validation for digits and common formats)
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/; // International format allowing + and 1-16 digits
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, ''); // Remove common separators
      if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
        newFieldErrors.phone = t("Please enter a valid phone number");
      }
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
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
          password2: confirmPassword,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
        }),
      });

      if (!response.ok) {
        let message = t("Registration failed");
        const newFieldErrors: {[key: string]: string} = {};
        
        try {
          const err = await response.json();
          console.log("Error response:", err); // Debug log
          
          if (typeof err === "object" && err !== null) {
            // Handle various error response formats
            
            // Method 1: Direct field errors with comprehensive field mapping
            const fieldMappings = {
              email: 'email',
              username: 'email', // Map username errors to email field
              phone_number: 'phone',
              phone: 'phone',
              password1: 'password',
              password: 'password',
              password2: 'confirmPassword',
              confirmPassword: 'confirmPassword',
              first_name: 'firstName',
              firstName: 'firstName',
              last_name: 'lastName',
              lastName: 'lastName'
            };

            // Process each field in the error response
            Object.entries(err).forEach(([apiField, errorValue]) => {
              if (fieldMappings[apiField as keyof typeof fieldMappings]) {
                const formField = fieldMappings[apiField as keyof typeof fieldMappings];
                let errorMessage = '';
                
                if (Array.isArray(errorValue)) {
                  errorMessage = errorValue[0];
                } else if (typeof errorValue === 'string') {
                  errorMessage = errorValue;
                } else if (typeof errorValue === 'object' && errorValue !== null) {
                  // Handle nested error objects
                  errorMessage = JSON.stringify(errorValue);
                }
                
                if (errorMessage) {
                  // Standardize error messages for consistency
                  if (formField === 'phone' && errorMessage.toLowerCase().includes('already')) {
                    newFieldErrors[formField] = t("Phone number already exist");
                  } else if (formField === 'email' && errorMessage.toLowerCase().includes('already')) {
                    newFieldErrors[formField] = t("Email already exists");
                  } else {
                    newFieldErrors[formField] = errorMessage;
                  }
                }
              }
            });

            // Method 2: Handle nested field_errors object
            if (err.field_errors && typeof err.field_errors === 'object') {
              Object.entries(err.field_errors).forEach(([field, error]) => {
                const formField = fieldMappings[field as keyof typeof fieldMappings] || field;
                let errorMessage = '';
                
                if (Array.isArray(error)) {
                  errorMessage = error[0];
                } else if (typeof error === 'string') {
                  errorMessage = error;
                }
                
                if (errorMessage) {
                  // Standardize error messages for consistency
                  if (formField === 'phone' && errorMessage.toLowerCase().includes('already')) {
                    newFieldErrors[formField] = t("Phone number already exist");
                  } else if (formField === 'email' && errorMessage.toLowerCase().includes('already')) {
                    newFieldErrors[formField] = t("Email already exists");
                  } else {
                    newFieldErrors[formField] = errorMessage;
                  }
                }
              });
            }

            // Method 3: Handle specific common error messages for email/phone existence
            if (err.message || err.detail) {
              const errorMsg = err.message || err.detail;
              if (typeof errorMsg === 'string') {
                if (errorMsg.toLowerCase().includes('email') && errorMsg.toLowerCase().includes('already')) {
                  newFieldErrors.email = t("Email already exists");
                } else if (errorMsg.toLowerCase().includes('phone') && errorMsg.toLowerCase().includes('already')) {
                  newFieldErrors.phone = t("Phone number already exist");
                } else if (errorMsg.toLowerCase().includes('username') && errorMsg.toLowerCase().includes('already')) {
                  newFieldErrors.email = t("Email already exists");
                } else {
                  message = errorMsg;
                }
              }
            }

            // Method 4: Handle non_field_errors
            if (err.non_field_errors) {
              if (Array.isArray(err.non_field_errors)) {
                message = err.non_field_errors.join(" | ");
              } else {
                message = err.non_field_errors;
              }
            }
            
            // Method 5: Handle general errors
            if (err.errors && Array.isArray(err.errors)) {
              message = err.errors.join(" | ");
            } else if (err.error && typeof err.error === 'string') {
              message = err.error;
            }

            // Method 6: Handle Django REST framework validation errors
            if (err.__all__) {
              if (Array.isArray(err.__all__)) {
                message = err.__all__.join(" | ");
              } else {
                message = err.__all__;
              }
            }

            // Method 7: Handle validation_error format
            if (err.validation_error && typeof err.validation_error === 'object') {
              Object.entries(err.validation_error).forEach(([field, error]) => {
                const formField = fieldMappings[field as keyof typeof fieldMappings] || field;
                let errorMessage = '';
                
                if (Array.isArray(error)) {
                  errorMessage = error[0];
                } else if (typeof error === 'string') {
                  errorMessage = error;
                }
                
                if (errorMessage) {
                  // Standardize error messages for consistency
                  if (formField === 'phone' && errorMessage.toLowerCase().includes('already')) {
                    newFieldErrors[formField] = t("Phone number already exist");
                  } else if (formField === 'email' && errorMessage.toLowerCase().includes('already')) {
                    newFieldErrors[formField] = t("Email already exists");
                  } else {
                    newFieldErrors[formField] = errorMessage;
                  }
                }
              });
            }
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          message = `${t("Registration failed")} (${response.status})`;
        }
        
        console.log("Field errors to set:", newFieldErrors); // Debug log
        
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        } else {
          setSubmitError(message);
        }
        return;
      }

      setSignupSuccess(true);
      clearFormFields();
    } catch (err: any) {
      console.error("Network error:", err);
      setSubmitError(err.message || t("Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputPropsWithRedAsterisk = {
    InputLabelProps: {
      sx: { "& .MuiFormLabel-asterisk": { color: "red" } },
    },
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-red-500 text-sm mt-1 ml-1">
      {message}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 relative pt-8">
      <div className="fixed top-8 left-1/4 transform -translate-x-1/2 z-50 pointer-events-auto">
        <Multilingual />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow p-8 w-full border-2 border-gray-200 min-h-[600px] overflow-visible">
          <div className="mb-6 sticky top-0 bg-white z-20 pb-4 border-b border-gray-100 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">{t("Register")}</h2>
            <p className="mt-1 text-sm text-gray-600">{t("Enter your details to create an account!")}</p>
            
            {/* Success Message */}
            {signupSuccess && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800 mr-3">
                      {t("Registration successful!")}
                    </span>
                    <Link
                      to="/welcome"
                      className="text-sm font-medium text-green-700 underline hover:text-green-800"
                    >
                      {t("Login")}
                    </Link>
                  </div>
                  <button
                    onClick={closeSuccessMessage}
                    className="text-green-400 hover:text-green-600 focus:outline-none"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <form className="flex flex-col gap-3 mt-6 w-full" onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <TextField
                    label={t("First Name")}
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    value={firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value, setFirstName)}
                    disabled={isSubmitting}
                    error={!!fieldErrors.firstName}
                    {...inputPropsWithRedAsterisk}
                  />
                  {fieldErrors.firstName && <ErrorMessage message={fieldErrors.firstName} />}
                </div>
                <div className="flex-1">
                  <TextField
                    label={t("Last Name")}
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    value={lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value, setLastName)}
                    disabled={isSubmitting}
                    error={!!fieldErrors.lastName}
                    {...inputPropsWithRedAsterisk}
                  />
                  {fieldErrors.lastName && <ErrorMessage message={fieldErrors.lastName} />}
                </div>
              </div>

              <div>
                <TextField
                  label={t("Email")}
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                  disabled={isSubmitting}
                  error={!!fieldErrors.email}
                  {...inputPropsWithRedAsterisk}
                />
                {fieldErrors.email && <ErrorMessage message={fieldErrors.email} />}
              </div>

              <div>
                <TextField
                  label={t("Phone Number")}
                  type="tel"
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  value={phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value, setPhone)}
                  disabled={isSubmitting}
                  error={!!fieldErrors.phone}
                  {...inputPropsWithRedAsterisk}
                />
                {fieldErrors.phone && <ErrorMessage message={fieldErrors.phone} />}
              </div>

              <div>
                <TextField
                  label={t("Password")}
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                  disabled={isSubmitting}
                  error={!!fieldErrors.password}
                  {...inputPropsWithRedAsterisk}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {fieldErrors.password && <ErrorMessage message={fieldErrors.password} />}
              </div>

              <div>
                <TextField
                  label={t("Confirm Password")}
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)}
                  disabled={isSubmitting}
                  error={!!fieldErrors.confirmPassword}
                  {...inputPropsWithRedAsterisk}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {fieldErrors.confirmPassword && <ErrorMessage message={fieldErrors.confirmPassword} />}
              </div>

              {/* General error message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <span>
                  {t("By creating an account you agree to our")}{" "}
                  <a href="#" className="text-blue-600 underline">{t("Terms and Conditions")}</a>{" "}
                  {t("and")}{" "}
                  <a href="#" className="text-blue-600 underline">{t("Privacy Policy")}</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? t("Signing up...") : t("Register")}
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
                className={`w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all ${
                  googleSignedIn ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <img src="https://img.icons8.com/color/16/google-logo.png" alt="Google" />
                {googleSignedIn ? t("Signed in with Google") : t("Continue with Google")}
              </button>

              <p className="mt-4 text-sm text-gray-600 text-center">
                {t("Already have an account?")}{" "}
                <Link to="/welcome" className="text-blue-600 hover:underline">{t("Sign in")}</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return <SignupForm />;
}