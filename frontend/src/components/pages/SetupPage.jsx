import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CameraIcon } from "@heroicons/react/24/outline"; // For profile picture icon

const SetupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Hey there! I am using Ultra.");
  const [profilePic, setProfilePic] = useState(null);

  // Handle profile picture selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // Show preview of the image
    }
  };

  // Proceed to Chat Page
  const handleNext = () => {
    if (name.trim()) {
      navigate("/chat"); // Navigate to chat only if name is filled
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Profile Info</h1>

      {/* Profile Picture Upload */}
      <label className="relative w-24 h-24">
        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
        {profilePic ? (
          <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-400" />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer">
            <CameraIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        )}
      </label>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full max-w-xs p-3 mt-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />

      {/* Status Input */}
      <input
        type="text"
        placeholder="Enter your status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full max-w-xs p-3 mt-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!name.trim()} // Disable if name is empty
        className={`mt-6 px-6 py-2 text-white font-semibold rounded-lg ${
          name.trim() ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default SetupPage;
