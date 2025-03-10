import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <span>{user ? `Welcome, ${user.username}` : 'WhatsApp Clone'}</span>
      {user && (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded">
          Logout
        </button>
      )}
    </nav>
  );
};

export default TopNavbar;