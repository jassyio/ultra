import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="w-64 bg-gray-100 dark:bg-gray-800 h-screen p-4 flex flex-col">
            <div className="mb-8">
                <span className="text-lg font-semibold dark:text-gray-300">WhatsApp Clone</span>
            </div>
            <nav className="flex flex-col flex-grow">
                <NavLink to="/chat" className={({ isActive }) => `p-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300'}`}>
                    Chats
                </NavLink>
                <NavLink to="/updates" className={({ isActive }) => `p-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300'}`}>
                    Updates
                </NavLink>
                <NavLink to="/calls" className={({ isActive }) => `p-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300'}`}>
                    Calls
                </NavLink>
            </nav>
            {user && (
                <button onClick={handleLogout} className="mt-auto p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300">
                    Logout
                </button>
            )}
        </aside>
    );
};

export default Sidebar;