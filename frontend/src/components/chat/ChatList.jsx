import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import ChatListItemSkeleton from "./ChatListItemSkeleton";

const ChatList = () => {
  const { chats, setSelectedChat, selectedChat, loading } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  // Restore selected chat from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      setSelectedChat(JSON.parse(savedChat));
    }
  }, [setSelectedChat]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    localStorage.setItem("selectedChat", JSON.stringify(chat));
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: theme.palette.background.default }}>
      <Box sx={{ height: 108, px: 4, pt: 6, bgcolor: theme.palette.background.paper }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
          Chats
        </Typography>
      </Box>
      <Box sx={{ px: 1 }}>
        {loading ? (
          Array.from(new Array(5)).map((_, index) => (
            <ChatListItemSkeleton key={index} />
          ))
        ) : chats.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: theme.palette.text.secondary, mt: 8 }}>No chats yet</Box>
        ) : (
          chats.map((chat) => {
            const chatPartner = chat.participants.find((p) => p._id !== user?.id);
            if (!chatPartner) return null;

            return (
              <Box
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 72,
                  px: 3,
                  cursor: 'pointer',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: selectedChat?._id === chat._id ? 'action.selected' : 'background.paper',
                  transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.01)',
                  },
                  '&:active': {
                    transform: 'scale(0.99)',
                  },
                }}
              >
                <Avatar
                  src={chatPartner.avatar || "/default-avatar.png"}
                  alt={chatPartner.name}
                  sx={{ width: 49, height: 49, marginRight: "12px" }}
                />
                <Box sx={{ flex: 1, minWidth: 0, borderTop: "1px solid", borderColor: "divider", py: "10px" }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontSize: "17px", lineHeight: "21px", color: theme.palette.text.primary, fontWeight: 600, letterSpacing: 0.2 }}>
                      {chatPartner.name}
                    </Typography>
                    {chat.lastMessage && (
                      <Typography variant="caption" sx={{ fontSize: "xs", color: theme.palette.text.secondary }}>
                        {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    )}
                  </Box>
                  {chat.lastMessage && (
                    <Typography variant="body2" sx={{ fontSize: "14px", color: theme.palette.text.secondary, truncate: true, mt: 0.5 }}>
                      {chat.lastMessage.content}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default ChatList;