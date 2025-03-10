import React from 'react';

const FloatingButton = ({ onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-5 bg-green-500 text-white p-3 rounded-full shadow-lg"
    >
      {icon}
    </button>
  );
};

export default FloatingButton;