import { CameraAlt, Search, MoreVert, ArrowBack, Phone, VideoCall } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";

const TopNavbar = ({ title }) => {
  const { selectedChat, setSelectedChat } = useContext(ChatContext);
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        {selectedChat ? (
          // **Chat View Navbar**
          <>
            {/* Back Button */}
            <IconButton onClick={() => { setSelectedChat(null); navigate("/chats"); }}>
              <ArrowBack fontSize="small" />
            </IconButton>

            {/* Small Profile Picture & Name */}
            <Avatar src={selectedChat.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "0.9rem", maxWidth: 80, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedChat.name.length > 6 ? selectedChat.name.slice(0, 3) + "..." : selectedChat.name}
            </Typography>

            {/* Push icons to the right */}
            <Box sx={{ flexGrow: 1 }}></Box>

            {/* Call & Video Icons */}
            <IconButton>
              <Phone fontSize="small" />
            </IconButton>
            <IconButton>
              <VideoCall fontSize="small" />
            </IconButton>
          </>
        ) : (
          // **Default Navbar (Chat List)**
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {title}
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton>
                <CameraAlt fontSize="small" />
              </IconButton>
              <IconButton>
                <Search fontSize="small" />
              </IconButton>
              <IconButton>
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
