import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetupPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("mobile");

  const handleStart = () => {
    // Store theme and mode in local storage (mock setup)
    localStorage.setItem("theme", theme);
    localStorage.setItem("mode", mode);
    navigate("/chats"); // Navigate to main app
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen 
        ${theme === "dark" 
          ? "bg-gradient-to-r from-purple-700 to-gray-900 text-white"
          : "bg-gradient-to-r from-gray-100 to-purple-300 text-gray-900"}`}
    >
      <h2 className="text-2xl font-bold mb-6">Customize Your Experience</h2>

      <div className="space-y-4">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-semibold">Choose Theme</h3>
          <div className="flex gap-4 mt-2">
            <button
              className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${theme === "dark" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div>
          <h3 className="text-lg font-semibold">Choose Mode</h3>
          <div className="flex gap-4 mt-2">
            <button
              className={`px-4 py-2 rounded-lg ${mode === "mobile" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
              onClick={() => setMode("mobile")}
            >
              Mobile
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${mode === "desktop" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
              onClick={() => setMode("desktop")}
            >
              Desktop
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="mt-6 bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-800 transition"
      >
        Start Using Ultra
      </button>
    </div>
  );
};

export default SetupPage;
