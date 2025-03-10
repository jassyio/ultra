// src/layouts/AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      {children}
    </div>
  );
};

export default AuthLayout;
