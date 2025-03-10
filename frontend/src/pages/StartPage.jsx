import React from 'react';
import { Link } from 'react-router-dom';

const StartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-400 to-green-600 text-white">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to ULTRA chat</h1>
        <p className="text-lg">Connect with friends and family seamlessly.</p>
      </div>
      <Link
        to="/login"
        className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
      >
        Get Started
      </Link>
    </div>
  );
};

export default StartPage;