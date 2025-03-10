import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-200 flex justify-around p-4">
      <NavLink to="/chat" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600'}>Chats</NavLink>
      <NavLink to="/updates" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600'}>Updates</NavLink>
      <NavLink to="/calls" className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-gray-600'}>Calls</NavLink>
    </nav>
  );
};

export default BottomNavbar;