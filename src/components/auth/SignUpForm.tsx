import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        // Redirect to login page after message disappears
        setTimeout(() => {
          navigate("/signin");
        }, 500);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);
  return (
         <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
       <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
         <Link
           to="/"
           className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
         >
           <ChevronLeftIcon className="size-5" />
           Back to dashboard
         </Link>
       </div>
       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto min-h-0">
         <div className="border-2 border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
           <div className={`p-6 ${(successMessage || errorMessage) ? 'pb-8' : ''}`}>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your account to get started!
            </p>
          </div>
          <div>
            {successMessage && (
              <div className="mb-4 p-4 text-sm text-green-800 bg-green-100 border border-green-200 rounded-md relative animate-fade-in">
                <button
                  onClick={() => setSuccessMessage("")}
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
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Success!</span>
                </div>
                <p className="pr-6">{successMessage}</p>
                <div className="mt-2 text-xs text-green-600">
                  This message will automatically disappear in 5 seconds
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md relative">
                <button
                  onClick={() => setErrorMessage("")}
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
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Error</span>
                </div>
                <p className="mt-1 pr-6">{errorMessage}</p>
              </div>
            )}


            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              if (!isChecked) {
                setErrorMessage("Please accept the terms and conditions");
                return;
              }

              setIsSubmitting(true);
              setErrorMessage("");

              try {
                const derivedUsername = formData.email.includes("@") ? formData.email.split("@")[0] : formData.email;
                
                const response = await fetch("http://127.0.0.1:8000/auth/registration/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    username: derivedUsername,
                    email: formData.email,
                    password1: formData.password,
                    password2: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
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

                setSuccessMessage("✅ Account created successfully! Welcome to our platform.");
                
                // Clear form fields after successful registration
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: ""
                });
                setShowPassword(false);
                setIsChecked(false);
                
              } catch (err: any) {
                setErrorMessage(err.message || "Registration failed");
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
                         </div>
           </div>
         </div>
       </div>
     </div>
   </div>
   </div>
  );
}
