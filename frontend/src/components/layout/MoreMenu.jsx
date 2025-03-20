import React, { useState } from "react";

const MoreMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
        ⋮
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Notifications</button>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
