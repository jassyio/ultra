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

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <Box sx={{ height: "100vh", bgcolor: "background.default" }}>
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
            <Typography variant="h6">{user?.name || "Your Name"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.bio || "Hey there! I am using Ultra."}
            </Typography>
          </Box>
          <IconButton sx={{ ml: 1 }} size="small">
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
            <ListItemText primary="Account" secondary="Privacy, security, change number" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="Chats" secondary="Theme, wallpapers, chat history" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" secondary="Message, group & call tones" />
            <ArrowForwardIosIcon fontSize="small" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Privacy" secondary="Block contacts, disappearing messages" />
            <ArrowForwardIosIcon fontSize="small" />
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
          />
          <TextField
            label="Bio"
            fullWidth
            value={editBio}
            onChange={e => setEditBio(e.target.value)}
            margin="normal"
            multiline
            rows={2}
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