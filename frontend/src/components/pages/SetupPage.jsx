import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Switch,
  TextField,
  FormControlLabel,
  Typography,
  Dialog,
  Avatar,
  useTheme,
  Paper,
  Slider,
  IconButton,
} from "@mui/material";
import { Person, CameraAlt } from "@mui/icons-material";
import Cropper from "react-easy-crop";

function getCroppedImg(imageSrc, crop, zoom) {
  // Utility to crop image, see react-easy-crop docs for full implementation
  // For demo, just return the original imageSrc
  return Promise.resolve(imageSrc);
}

const SetupPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Handle profile picture selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cropping
  const handleCropComplete = useCallback(async (_, croppedAreaPixels) => {
    // You can use croppedAreaPixels with a canvas to crop the image
    // For simplicity, we just use the original image here
  }, []);

  const handleCropSave = async () => {
    // In production, use getCroppedImg to crop the image
    setProfilePic(cropImage);
    setCropDialogOpen(false);
  };

  // Proceed to Chat Page
  const handleNext = () => {
    if (name.trim()) {
      // Save profilePic, name, bio to backend or context here
      navigate("/chat");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: darkMode ? "#181c24" : "linear-gradient(135deg, #e7ffdb 0%, #b2f0e6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.3s",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          maxWidth: 400,
          width: "100%",
          bgcolor: darkMode ? "#23272f" : "#fff",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            Ultra
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: darkMode ? "#b2f0e6" : "#6b7280",
              fontWeight: 500,
              mb: 2,
            }}
          >
            Set up your profile
          </Typography>
        </Box>

        {/* Profile Picture Upload */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={profilePic}
              sx={{
                width: 110,
                height: 110,
                bgcolor: theme.palette.primary.light,
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                border: `4px solid ${theme.palette.primary.main}`,
                fontSize: 60,
              }}
            >
              {!profilePic && <Person fontSize="inherit" />}
            </Avatar>
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#fff",
                boxShadow: 2,
                "&:hover": { bgcolor: theme.palette.primary.light },
              }}
            >
              <CameraAlt fontSize="small" color="primary" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfilePicChange}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Crop Dialog */}
        <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} maxWidth="xs">
          <div style={{ width: 300, height: 300, position: "relative" }}>
            {cropImage && (
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            )}
          </div>
          <Box sx={{ p: 2 }}>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(value)}
            />
            <Button onClick={handleCropSave} variant="contained" color="primary" fullWidth>
              Save
            </Button>
          </Box>
        </Dialog>

        {/* Form Inputs */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Display Name
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 30 }}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Bio <span style={{ color: "#888", fontWeight: 400 }}>(optional)</span>
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 80 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Theme
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
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              py: 1.5,
              fontSize: "1.1rem",
              letterSpacing: 1,
            }}
            onClick={handleNext}
            disabled={!name.trim()}
          >
            Save & Continue
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SetupPage;