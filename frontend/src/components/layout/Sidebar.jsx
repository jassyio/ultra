import { useState } from "react";
import { FaComments, FaUsers, FaPhone, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`h-screen bg-gray-900 text-white fixed top-0 left-0 transition-all ${
        isOpen ? "w-64" : "w-16"
      } hidden md:flex flex-col`}
    >
      <button
        className="text-white p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      <nav className="flex flex-col space-y-4 mt-4">
        <Link to="/chats" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700">
          <FaComments />
          {isOpen && <span>Chats</span>}
        </Link>
        <Link to="/updates" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700">
          <FaUsers />
          {isOpen && <span>Updates</span>}
        </Link>
        <Link to="/communities" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700">
          <FaUsers />
          {isOpen && <span>Communities</span>}
        </Link>
        <Link to="/calls" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700">
          <FaPhone />
          {isOpen && <span>Calls</span>}
        </Link>
        <Link to="/settings" className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700">
          <FaCog />
          {isOpen && <span>Settings</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
