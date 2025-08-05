// e.g., src/components/common/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin"); // 👈 safely redirect
    document.title = "Sign In"; // 👈 reset tab title
  };

  return (
    <Button color="error" variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
