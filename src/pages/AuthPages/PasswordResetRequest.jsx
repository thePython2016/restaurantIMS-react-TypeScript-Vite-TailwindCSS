import React from 'react';
import PublicOrderForm from '../Forms/PublicOrderForm';
import PasswordResetRequest from './PasswordResetRequest'; // ✅ Make sure the path is correct

const PasswordResetPage = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side: Full Orange */}
      <div className="w-1/2 h-full bg-orange-500 flex items-center justify-center">
        <PublicOrderForm />
      </div>

      {/* Right Side: Blue background with Password Reset */}
      <div className="w-1/2 h-full bg-blue-600 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-2xl">
          <PasswordResetRequest />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage ;
