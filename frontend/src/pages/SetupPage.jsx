import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetupPage = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("light");
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const handleSave = () => {
    console.log({ displayName, bio, theme, profilePic });
    navigate("/chat");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-[#1A0033] via-[#4B0082] to-[#9C27B0] text-white relative">
      {/* Geometric Background Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.05)_25%,_transparent_25%,_transparent_75%,_rgba(255,255,255,0.05)_75%,_rgba(255,255,255,0.05))] bg-[20px_20px]"></div>

      <div className="w-full max-w-md px-6 py-8 bg-black bg-opacity-60 rounded-lg shadow-xl relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Setup Your Profile</h2>

        {/* Profile Picture Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="w-full p-2 bg-gray-800 rounded-lg border border-gray-600 text-gray-200"
          />
        </div>

        {/* Display Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        {/* Bio Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200"
            placeholder="Write a short bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Theme Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
          <select
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
          onClick={handleSave}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default SetupPage;
