import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const TopNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white flex items-center justify-between px-4 py-3 shadow-md">
      {/* Logo / App Name */}
      <NavLink to="/" className="text-lg font-bold text-purple-400">
        UltraChat
      </NavLink>

      {/* Right side icons */}
      <div className="flex space-x-4">
        <button className="hover:text-purple-400 transition">
          <FaSearch size={20} />
        </button>
        <button className="hover:text-purple-400 transition">
          <FaEllipsisV size={20} />
        </button>
      </div>
    </nav>
  );
};

export default TopNavbar;
