import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { accessToken } = useAuth();
  
  useEffect(() => {
    document.title = "Change Password";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordFormData>();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (!accessToken) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      
      // Try to get token from context first, then fallback to localStorage/sessionStorage
      const token = accessToken || localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      console.log("Making password change request with token:", token.substring(0, 20) + "...");
      console.log("Request payload:", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });

      // The Django backend expects these exact field names
      const requestBody = {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      };

      let response;
      let lastError;

      // Try the main endpoint first
      try {
        console.log(`Trying endpoint: http://127.0.0.1:8000/change-password/`);
        response = await axios.post(
          "http://127.0.0.1:8000/change-password/",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        console.log(`Success with endpoint: http://127.0.0.1:8000/change-password/`);
      } catch (error: any) {
        lastError = error;
        console.log(`Failed with endpoint http://127.0.0.1:8000/change-password/:`, error.response?.status, error.response?.statusText);
        console.log(`Error response data:`, error.response?.data);
        
        // If the main endpoint fails, try without trailing slash
        if (error.response?.status === 404) {
          try {
            console.log(`Trying endpoint: http://127.0.0.1:8000/change-password`);
            response = await axios.post(
              "http://127.0.0.1:8000/change-password",
              requestBody,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
            console.log(`Success with endpoint: http://127.0.0.1:8000/change-password`);
          } catch (secondError: any) {
            lastError = secondError;
            console.log(`Failed with endpoint http://127.0.0.1:8000/change-password:`, secondError.response?.status, secondError.response?.statusText);
            console.log(`Error response data:`, secondError.response?.data);
          }
        }
      }

      if (!response) {
        throw lastError;
      }

      console.log("Response received:", response);
      
      if (response.status === 200) {
        alert("Password changed successfully.");
        reset();
      }
    } catch (error: any) {
      console.error("Password change error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
      
      let errorMessage = "Error changing password.";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || error.response?.data?.message || "Invalid request data.";
      } else if (error.response?.status === 404) {
        errorMessage = "Change password endpoint not found. Please contact support.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data) {
        errorMessage = error.response?.data?.detail || error.response?.data?.message || errorMessage;
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordInput = (
    name: keyof PasswordFormData,
    label: string,
    show: boolean,
    toggle: () => void
  ) => (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register(name, { required: true })}
          className="w-full border px-3 py-2 rounded pr-10"
        />
        <span
          onClick={toggle}
          className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
        >
          {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{label} is required</p>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {passwordInput("currentPassword", "Current Password", showCurrent, () =>
          setShowCurrent(!showCurrent)
        )}
        {passwordInput("newPassword", "New Password", showNew, () =>
          setShowNew(!showNew)
        )}
        {passwordInput(
          "confirmPassword",
          "Confirm New Password",
          showConfirm,
          () => setShowConfirm(!showConfirm)
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
