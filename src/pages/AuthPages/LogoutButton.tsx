// e.g., src/components/common/LogoutButton.tsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // logout() now handles the redirect to /welcome
  };

  return (
    <Button color="error" variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
