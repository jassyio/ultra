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
} from "@mui/material";
import TopNavbar from "../layout/TopNavbar";
import MessageInput from "../chat/MessageInput";
import Message from "../chat/Message";
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
  } = useContext(ChatContext);
  const { user, logout } = useContext(AuthContext); // <-- get logout from context
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
    alert("New group (not implemented)");
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
    logout(); // <-- clear user from context
    navigate("/"); // Redirect to start page
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

  // Get chat partner from chat list
  const chatPartner =
    selectedChat &&
    chats.find((c) => c._id === selectedChat._id)?.participants.find(
      (p) => p._id !== user?.id
    );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar with title and menu */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 1 }}>
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

      <Box 
        sx={{ 
          flex: 1, 
          position: "relative", 
          mt: "48px",
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
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
              backgroundColor: "rgba(255, 255, 255, 0.8)",
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
          <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
            {chats.length > 0 ? (
              chats.map((chat) => {
                const partner = chat.participants.find(
                  (p) => p._id !== user?.id
                );
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
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={partner?.avatar || "/default-avatar.png"}
                      alt={partner?.name}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {partner?.name}
                      </Typography>
                      {chat.lastMessage && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {chat.lastMessage.sender === user?.id ? "You: " : ""}
                          {chat.lastMessage.content}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                {loading
                  ? "Loading chats..."
                  : "No chats available. Start a new conversation!"}
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