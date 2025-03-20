import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SetupPage = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const userRegistered = localStorage.getItem("userRegistered");
    if (!userRegistered) {
      navigate("/register"); // Prevent access if not registered
    }
  }, [navigate]);

  // Handle Profile Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle Profile Setup Completion
  const handleSetupComplete = () => {
    if (!displayName) {
      alert("Please enter a display name.");
      return;
    }

    // Save data (In real case, send to backend)
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("profilePic", preview);

    console.log("Profile Set:", { displayName, profilePic });

    // Redirect to Chats
    navigate("/chats");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Set Up Your Profile</h2>

        <div className="mt-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <label className="cursor-pointer">
              {preview ? (
                <img src={preview} alt="Profile" className="w-24 h-24 rounded-full border-2 border-blue-500" />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-500">
                  Upload
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Display Name Input */}
          <div className="mt-4">
            <label className="block text-gray-700 dark:text-gray-300">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          {/* Complete Setup Button */}
          <button
            onClick={handleSetupComplete}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
