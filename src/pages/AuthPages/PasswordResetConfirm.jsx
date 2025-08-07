import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PasswordResetConfirm() {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== reNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/auth/password/reset/confirm/", {
        uid,
        token,
        new_password: newPassword,
        re_new_password: reNewPassword,
      });
      setMessage("✅ Password has been reset successfully.");
      setNewPassword("");
      setReNewPassword("");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to reset password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow">
      <h2 className="text-xl font-bold mb-4">Set New Password</h2>

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="border p-2 w-full mb-3"
      />

      <input
        type="password"
        placeholder="Confirm new password"
        value={reNewPassword}
        onChange={(e) => setReNewPassword(e.target.value)}
        required
        className="border p-2 w-full mb-3"
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Reset Password
      </button>

      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
