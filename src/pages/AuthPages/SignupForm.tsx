import React from 'react';
import PublicOrderForm from '../Forms/PublicOrderForm';
import { SignupForm } from './SignUp';

const SignupFormPage = () => {
  return (
    <div className="flex h-screen w-screen">
      {/* Left - Full orange background */}
      <div className="w-1/2 h-full bg-orange-200 flex items-center justify-center">
        <PublicOrderForm />
      </div>

      {/* Right - Fills remaining space */}
      <div className="flex-1 h-full bg-white flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-2xl">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupFormPage;
