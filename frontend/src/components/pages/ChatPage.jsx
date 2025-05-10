import React, { useState, useContext, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TopNavbar from "../layout/TopNavbar";
import MessageInput from "../chat/MessageInput";
import Message from "../chat/Message";
import FloatingButton from "../common/FloatingButton";
import AddIcon from "@mui/icons-material/Add";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext"; // To get the current user
import AddChatModal from "../chat/AddChatModal";
import axios from "axios";

const ChatPage = () => {
  const { chats, setChats, selectedChat, setSelectedChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch chats when the component mounts or when navigating back
  useEffect(() => {
  const fetchChats = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/chats");
      console.log("Fetched Chats:", data); // Debugging log
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  fetchChats();
}, [setChats]);


  // Function to update the last message in the chat list
  const updateLastMessage = (chatId, message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId ? { ...chat, lastMessage: message } : chat
      )
    );
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopNavbar title={selectedChat ? selectedChat.name : "Ultra"} />

      {!selectedChat ? (
        <Box sx={{ flex: 1, overflowY: "auto", p: 1, mt: "48px" }}>
          {chats.length > 0 ? (
            chats.map((chat, index) => {
  console.log("Chat:", chat);
  console.log("Participants:", chat?.participants);

  const participant =
    chat?.participants?.length > 1
      ? chat?.participants?.find((p) => p._id !== user?.id)
      : null;

  console.log("Participant:", participant);

  return (
    <Box
      key={chat?._id || chat?.id || index}
      onClick={() => setSelectedChat(chat)}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #ccc",
        cursor: "pointer",
      }}
    >
      <img
        src={participant?.avatar || "/default-avatar.png"} // Fallback to default avatar
        alt={participant?.name || "Unnamed User"} // Fallback to "Unnamed User"
        style={{ width: 40, height: 40, borderRadius: "50%" }}
      />
      <Box sx={{ ml: 2 }}>
        <Typography sx={{ fontWeight: "bold" }}>
          {participant?.name || "Unnamed User"} {/* Fallback for missing name */}
        </Typography>
        <Typography sx={{ color: "gray" }}>
          {chat?.lastMessage?.content || "No messages yet"} {/* Fallback for missing lastMessage */}
        </Typography>
      </Box>
    </Box>
              );
            })
          ) : (
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              No chats available
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            mt: "48px",
            overflowY: "auto",
          }}
        >
          <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
            {selectedChat.messages?.length > 0 ? (
              selectedChat.messages.map((msg, i) => (
                <Message
                  key={i}
                  msg={msg}
                  onSendMessage={(message) =>
                    updateLastMessage(selectedChat._id, message)
                  }
                />
              ))
            ) : (
              <Typography sx={{ textAlign: "center", mt: 2 }}>
                No messages yet
              </Typography>
            )}
          </Box>
          <MessageInput
            sendMessage={(msg) => {
              // Update context here or via socket
              updateLastMessage(selectedChat._id, msg);
            }}
          />
        </Box>
      )}

      <FloatingButton icon={<AddIcon />} onClick={() => setModalOpen(true)} />

      <AddChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ChatPage;
