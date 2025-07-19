import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import TopNavbar from "../layout/TopNavbar";
import FloatingButton from "../common/FloatingButton";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import CampaignIcon from "@mui/icons-material/Campaign";
import DevicesIcon from "@mui/icons-material/Devices";
import StarIcon from "@mui/icons-material/Star";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import AddChatModal from "../chat/AddChatModal";
import ChatWindow from "../chat/ChatWindow";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    loading,
    error,
    clearError,
    fetchChats,
  } = useContext(ChatContext);
  const { user, logout } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const moreButtonRef = useRef(null);

  const handleMenuClick = (event) => {
    setAnchorEl(moreButtonRef.current);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menu item handlers
  const handleNewGroup = () => {
    navigate("/groups/new");
    handleMenuClose();
  };
  const handleNewBroadcast = () => {
    alert("New broadcast (not implemented)");
    handleMenuClose();
  };
  const handleLinkedDevices = () => {
    alert("Linked devices (not implemented)");
    handleMenuClose();
  };
  const handleStarredMessages = () => {
    navigate("/starred");
    handleMenuClose();
  };
  const handleSettings = () => {
    navigate("/settings");
    handleMenuClose();
  };
  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  // Socket status tracking
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => setSocketConnected(true));
      socket.on("disconnect", () => setSocketConnected(false));
      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Get chat partner from chat list
  const chatPartner = (() => {
    if (!selectedChat) return null;
    const chat = chats.find((c) => c._id === selectedChat._id);
    if (chat && Array.isArray(chat.participants)) {
      return chat.participants.find((p) => p._id !== user?.id);
    }
    return null;
  })();

  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        // width: '100vw',
        // overflowX: 'hidden',
      }}
    >
      {/* Top bar with title and menu */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '100%', pt: 1 }}>
        <TopNavbar
          title={selectedChat ? chatPartner?.name || "Chat" : "Ultra"}
          avatar={
            selectedChat ? chatPartner?.avatar || "/default-avatar.png" : undefined
          }
          showBackButton={!!selectedChat}
          onBack={() => setSelectedChat(null)}
          onMoreClick={handleMenuClick}
          moreButtonRef={moreButtonRef}
        />
      </Box>

      {/* Menu anchored to the MoreVert icon in TopNavbar */}
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleNewGroup}>
          <ListItemIcon><GroupIcon fontSize="small" /></ListItemIcon>
          New group
        </MenuItem>
        <MenuItem onClick={handleNewBroadcast}>
          <ListItemIcon><CampaignIcon fontSize="small" /></ListItemIcon>
          New broadcast
        </MenuItem>
        <MenuItem onClick={handleLinkedDevices}>
          <ListItemIcon><DevicesIcon fontSize="small" /></ListItemIcon>
          Linked devices
        </MenuItem>
        <MenuItem onClick={handleStarredMessages}>
          <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
          Starred messages
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <Typography sx={{ color: "error.main" }}>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Main chat content area, fill available space */}
      <Box 
        sx={{ 
          flex: 1, 
          position: "relative", 
          mt: "48px",
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: theme.palette.background.default,
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.background.default,
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={clearError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        {!selectedChat ? (
          <Box sx={{ flex: 1, overflowY: "auto", p: 0, bgcolor: theme.palette.background.paper }}>
            {chats.length > 0 ? (
              chats.map((chat) => {
                // Detect if this is a group (has members) or a direct chat (has participants)
                const isGroup = Array.isArray(chat.members);
                let displayName, displayAvatar;

                if (isGroup) {
                  displayName = chat.name;
                  displayAvatar = "/default-group-avatar.png";
                } else {
                  // Defensive: check if participants exists and has at least one user
                  const partner = Array.isArray(chat.participants) && chat.participants.length > 0
                    ? chat.participants[0]
                    : null;
                  displayName = partner?.name || "Unknown";
                  displayAvatar = partner?.avatar || "/default-avatar.png";
                }

                return (
                  <Box
                    key={`chat-${chat._id}`}
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: 1,
                      cursor: "pointer",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      display: "flex",
                      alignItems: "center",
                      mx: 0 // Remove side margin
                    }}
                  >
                    <Avatar
                      src={displayAvatar}
                      alt={displayName}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ color: theme.palette.text.primary }}>
                        {displayName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {chat.lastMessage?.content || "No messages yet"}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {chat.lastMessage?.createdAt
                        ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ""}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Typography sx={{ color: theme.palette.text.secondary, textAlign: 'center', mt: 8 }}>
                No chats yet
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <ChatWindow />
          </Box>
        )}
      </Box>

      {!selectedChat && (
        <FloatingButton
          icon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          disabled={loading}
        />
      )}

      <AddChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ChatPage;