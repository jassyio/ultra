import { useState } from "react";

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-72 bg-gray-900 text-white h-screen p-4">
      {/* Profile & Search */}
      <div className="flex items-center justify-between mb-4">
        <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-800 p-2 rounded w-full text-sm"
        />
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto">
        <p className="text-gray-400">Your chats appear here...</p>
      </div>
    </div>
  );
};

export default Sidebar;
