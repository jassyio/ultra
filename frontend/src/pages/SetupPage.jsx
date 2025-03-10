import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // Corrected import path
import { useNavigate } from 'react-router-dom';

const SetupPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleThemeChange = () => {
    toggleTheme();
  };

  const handleNext = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold mb-4">Choose your theme:</h2>
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={handleThemeChange}
          className={`px-6 py-3 rounded-md ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Light
        </button>
        <button
          onClick={handleThemeChange}
          className={`px-6 py-3 rounded-md ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Dark
        </button>
      </div>
      <button
        onClick={handleNext}
        className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Next
      </button>
    </div>
  );
};

export default SetupPage;