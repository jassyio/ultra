import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Switch, TextField, FormControlLabel, Typography } from "@mui/material";
import { Person } from "@mui/icons-material"; // Dummy face icon

const SetupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // Handle profile picture selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // Show preview
    }
  };

  // Proceed to Chat Page
  const handleNext = () => {
    if (name.trim()) {
      navigate("/chat"); // This should work if routing is set up properly
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <Typography variant="h4" component="h1" className="mb-2 font-semibold">
        Ultra
      </Typography>
      <Typography variant="body2" className="text-sm text-gray-500 mb-8">
        Set Up Your Profile
      </Typography>

      {/* Profile Picture Upload */}
      <label className="relative flex items-center justify-center mb-6 rounded-full border-4 border-gray-400 bg-gray-300 dark:bg-gray-700 cursor-pointer overflow-hidden">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePicChange}
        />
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover"
          />
        ) : (
          <div className="w-40 h-40 flex justify-center items-center rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-gray-400">
            <Person className="w-32 h-32 text-gray-600 dark:text-gray-400" />
          </div>
        )}
      </label>

      {/* Form Inputs */}
      <div className="w-full max-w-sm space-y-6">
        {/* Display Name */}
        <div>
          <Typography variant="body1" className="font-semibold mb-1">
            Display Name
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mb-4"
          />
        </div>

        {/* Bio */}
        <div>
          <Typography variant="body1" className="font-semibold mb-1">
            Bio (Optional)
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            className="mb-4"
          />
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-between items-center">
          <Typography variant="body2" className="text-sm">
            Choose Theme
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="primary"
                size="small"
              />
            }
            label={darkMode ? "Dark" : "Light"}
          />
        </div>

        {/* Save & Continue Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleNext}
          disabled={!name.trim()}
          className="mt-4"
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default SetupPage;
