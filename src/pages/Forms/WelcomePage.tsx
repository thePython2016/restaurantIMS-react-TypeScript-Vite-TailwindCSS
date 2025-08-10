import React from 'react';
import SignIn from '../AuthPages/SignIn';
import PublicOrderForm from './PublicOrderForm';

const Welcome = () => {
  return (
    <div className="flex h-screen w-screen">
      {/* Left - Full orange background (no gray or white) */}
      <div className="w-1/2 h-full bg-orange-200 flex items-center justify-center">
        <PublicOrderForm />
      </div>

      {/* Right - Fills remaining space */}
      <div className="flex-1 h-full bg-blue-600 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-2xl">
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
