import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import TopNavbar from "../layout/TopNavbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const theme = useTheme();

  // Profile edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [editAvatar, setEditAvatar] = useState(user?.avatar || "/default-avatar.png");

  useEffect(() => {
    console.log("SettingsPage loaded");
  }, []);

  const handleProfileClick = () => setEditOpen(true);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setEditAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // TODO: Save to backend/context
    // Example: updateUserProfile({ name: editName, bio: editBio, avatar: editAvatar });
    setEditOpen(false);
  };

  return (
    <Box sx={{ height: "100vh", bgcolor: theme.palette.background.default }}>
      <TopNavbar
        title="Settings"
        showBackButton
        onBack={() => navigate(-1)}
      />

      <Box sx={{ pt: 8, px: 2 }}>
        {/* Profile Info */}
        <Box
          sx={{ display: "flex", alignItems: "center", mb: 3, cursor: "pointer" }}
          onClick={handleProfileClick}
        >
          <Avatar
            src={editAvatar}
            sx={{ width: 64, height: 64, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>{user?.name || "Your Name"}</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {user?.bio || "Hey there! I am using Ultra."}
            </Typography>
          </Box>
          <IconButton sx={{ ml: 1, color: theme.palette.text.primary }} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        {/* Settings Options */}
        <List>
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={<span style={{color: theme.palette.text.primary}}>Account</span>} secondary={<span style={{color: theme.palette.text.secondary}}>Privacy, security, change number</span>} />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary={<span style={{color: theme.palette.text.primary}}>Chats</span>} secondary={<span style={{color: theme.palette.text.secondary}}>Theme, wallpapers, chat history</span>} />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary={<span style={{color: theme.palette.text.primary}}>Notifications</span>} secondary={<span style={{color: theme.palette.text.secondary}}>Message, group & call tones</span>} />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary={<span style={{color: theme.palette.text.primary}}>Privacy</span>} secondary={<span style={{color: theme.palette.text.secondary}}>Block contacts, disappearing messages</span>} />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          {/* Theme Switcher */}
          <ListItem>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary={<span style={{color: theme.palette.text.primary}}>Theme</span>} secondary={<span style={{color: theme.palette.text.secondary}}>Switch between Light and Dark mode</span>} />
            <FormControlLabel
              control={
                <Switch
                  checked={themeMode === 'dark'}
                  onChange={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                  color="primary"
                  size="small"
                />
              }
              label={themeMode === 'dark' ? "Dark" : "Light"}
            />
          </ListItem>
        </List>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Avatar src={editAvatar} sx={{ width: 80, height: 80, mb: 1 }} />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
          <TextField
            label="Name"
            fullWidth
            value={editName}
            onChange={e => setEditName(e.target.value)}
            margin="normal"
            InputProps={{
              style: {
                color: theme.palette.text.primary,
                background: theme.palette.background.paper,
              },
            }}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.background.paper,
            }}
          />
          <TextField
            label="Bio"
            fullWidth
            value={editBio}
            onChange={e => setEditBio(e.target.value)}
            margin="normal"
            multiline
            rows={2}
            InputProps={{
              style: {
                color: theme.palette.text.primary,
                background: theme.palette.background.paper,
              },
            }}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.background.paper,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSaveProfile}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;