import React from "react";
import SignIn from "../AuthPages/SignIn";
import PublicOrderForm from "../Forms/PublicOrderForm";
import PasswordResetConfirm from "./PasswordResetConfirm.jsx";

const PasswordConfirmPage = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side - Gradient with circles */}
      <div className="w-1/2 h-full relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden flex items-center justify-center text-white">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>

        {/* PublicOrderForm */}
        <div className="relative z-10 px-8 w-full max-w-2xl">
          <PublicOrderForm />
        </div>
      </div>

      {/* Right Side - Password Reset */}
      <div className="flex-1 h-full bg-white flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <PasswordResetConfirm/>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmPage;
