import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import { Box, IconButton, Tooltip, Dialog, Tabs, Tab, Typography, Button, Avatar } from "@mui/material";
import Message from "./Message";
import MessageInput from "./MessageInput";
import TopNavbar from "../layout/TopNavbar";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleIcon from "@mui/icons-material/People";
import CallIcon from "@mui/icons-material/Call";
import AddGroupMemberModal from "../groups/AddGroupMemberModal";
import GroupInfo from "../groups/GroupInfo";
import { useTheme } from "@mui/material/styles";
import { Search, MoreVert } from "@mui/icons-material";
import CallInterface from "../calls/CallInterface";
import Videocam from "@mui/icons-material/Videocam";
import axios from "axios";

const ChatWindow = () => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    messages,
    fetchMessagesForChat,
    addMessageToChat,
    updateChatWithNewMessage,
    setMessages,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket, isConnected, incomingCall, setIncomingCall } = useContext(SocketContext);

  const messagesEndRef = useRef(null);

  // Single modal state and tab index
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupTab, setGroupTab] = useState(0);
  const [callActive, setCallActive] = useState(false); // New state for call active
  const [isVideoCall, setIsVideoCall] = useState(false); // State to toggle between voice and video calls

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessagesForChat(selectedChat._id);
    }
  }, [selectedChat?._id]);

  // Update socket handler to be more robust
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleIncomingMessage = (message) => {
      if (!message || !message.chatId) {
        console.warn("Received invalid socket message", message);
        return;
      }

      const chatId = message.chatId || message.chat?._id;

      // Don't skip your own messages - let the handler dedupe them
      updateChatWithNewMessage(chatId, message);
    };

    socket.on("message received", handleIncomingMessage);
    return () => socket.off("message received", handleIncomingMessage);
  }, [socket, selectedChat?._id, updateChatWithNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedChat?._id]?.length]);

  const chat = chats.find((c) => c._id === selectedChat?._id);

  let chatPartner = null;
  let chatTitle = "Chat";
  let chatAvatar = "/default-avatar.png";
  let isGroup = false;

  if (chat) {
    if (Array.isArray(chat.participants)) {
      // Direct chat
      chatPartner = chat.participants.find((p) => p._id !== user?.id);
      chatTitle = chatPartner?.name || "Chat";
      chatAvatar = chatPartner?.avatar || "/default-avatar.png";
    } else if (Array.isArray(chat.members)) {
      // Group chat
      isGroup = true;
      chatTitle = chat.name || "Group";
      chatAvatar = "/default-group-avatar.png";
    }
  }

  if (!selectedChat || (!chatPartner && !Array.isArray(chat?.members))) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const chatMessages = messages[selectedChat._id] || [];

  const handleSendMessage = async (content) => {
    if (!selectedChat?._id || !content.trim() || !user?.id) return;

    const pendingMsg = {
      _id: Date.now().toString(),
      sender: user.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      chatId: selectedChat._id,
      isPending: true, // Make sure this is set!
    };

    addMessageToChat(selectedChat._id, pendingMsg);
    updateChatWithNewMessage(selectedChat._id, pendingMsg); // Only call updateChatWithNewMessage once with the pending message

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `http://localhost:3001/api/messages/send`,
        {
          chatId: selectedChat._id,
          sender: user.id,
          content: content.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const confirmed = data.data;

      setMessages((prev) => {
        const existing = prev[selectedChat._id] || [];
        const filtered = existing.filter(
          (m) => !(m.isPending && m.content === content.trim()) // Remove reference to tempId
        );
        return {
          ...prev,
          [selectedChat._id]: [...filtered, confirmed],
        };
      });

      // No call to updateChatWithNewMessage here anymore (avoid double)
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  const handleAcceptCall = () => {
    console.log("Call accepted");
    setIncomingCall(null); // Clear incoming call state
    // Start the call interface here
  };

  const handleRejectCall = () => {
    console.log("Call rejected");
    setIncomingCall(null); // Clear incoming call state
    // Notify the caller about rejection (optional)
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Incoming Call Modal */}
      {incomingCall && (
        <Dialog open={true} onClose={handleRejectCall}>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Avatar
              src={incomingCall.caller.avatar || "/default-avatar.png"}
              alt={incomingCall.caller.name || "Caller"}
              sx={{ width: 80, height: 80, margin: "0 auto" }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {incomingCall.caller.name || "Unknown Caller"}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "gray", mt: 1 }}>
              {incomingCall.callType === "video" ? "Incoming Video Call" : "Incoming Voice Call"}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleAcceptCall}>
                Accept
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleRejectCall}>
                Reject
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}

      {/* Hide TopNavbar and render CallInterface */}
      {callActive ? (
        <CallInterface
          participants={isGroup ? chat.members : [chatPartner]} // Use chat.members for group calls
          groupName={isGroup ? chat.name : null} // Pass group name for group calls
          groupAvatar={isGroup ? chat.avatar : null} // Pass group avatar for group calls
          isVideoCall={isVideoCall} // Pass the isVideoCall state
          onEndCall={() => {
            console.log("Call ended");
            setCallActive(false); // Reset call state
          }}
        />
      ) : (
        <>
          <TopNavbar
            title={chatTitle}
            avatar={chatAvatar}
            showBackButton={!!selectedChat}
            onBack={() => setSelectedChat(null)}
            actions={
              isGroup ? (
                <>
                  {/* Group Info Icon */}
                  <Tooltip title="Group Info">
                    <IconButton
                      onClick={() => setGroupModalOpen(true)} // Open group info modal
                    >
                      <PeopleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Add Member Icon */}
                  <Tooltip title="Add Member">
                    <IconButton
                      onClick={() => setGroupTab(1) || setGroupModalOpen(true)} // Open add member tab in modal
                    >
                      <GroupAddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Start Call Icon */}
                  <Tooltip title="Start Call">
                    <IconButton
                      onClick={() => {
                        setCallActive(true);
                        setIsVideoCall(false); // Start as voice call
                        console.log("Call started");
                      }}
                    >
                      <CallIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Start Video Call Icon */}
                  <Tooltip title="Start Video Call">
                    <IconButton
                      onClick={() => {
                        setCallActive(true);
                        setIsVideoCall(true); // Start as video call
                        console.log("Video call started");
                      }}
                    >
                      <Videocam fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  {/* Direct Chat Call Icons */}
                  <Tooltip title="Start Call">
                    <IconButton
                      onClick={() => {
                        setCallActive(true);
                        setIsVideoCall(false); // Start as voice call
                        console.log("Call started");
                      }}
                    >
                      <CallIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Start Video Call">
                    <IconButton
                      onClick={() => {
                        setCallActive(true);
                        setIsVideoCall(true); // Start as video call
                        console.log("Video call started");
                      }}
                    >
                      <Videocam fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )
            }
          />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              bgcolor: "#f0f2f5",
              pb: 2,
              display: "flex",
              flexDirection: "column",
            }}
            className="dark:bg-gray-900"
          >
            <Box sx={{ py: 3, px: "5%" }}>
              {chatMessages.length > 0 ? (
                chatMessages.map((msg, index) => (
                  <Message
                    key={msg._id || msg.tempId || index}
                    message={msg}
                    isOwnMessage={
                      (typeof msg.sender === "object"
                        ? msg.sender._id
                        : msg.sender) === user.id
                    }
                    isPending={msg.isPending}
                  />
                ))
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    color: "#8696a0",
                    mt: 10,
                    fontSize: "0.875rem",
                  }}
                >
                  No messages yet
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Box>

          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              width: "100%",
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
            className="dark:bg-gray-800 dark:border-gray-700"
          >
            <MessageInput
              chatId={selectedChat._id}
              onMessageSent={handleSendMessage}
              disabled={!isConnected}
            />
          </Box>

          {/* Group Management Modal with Tabs */}
          {isGroup && (
            <Dialog
              open={groupModalOpen}
              onClose={() => setGroupModalOpen(false)}
              maxWidth="xs"
              fullWidth
            >
              <Box sx={{ p: 2, minWidth: 320 }}>
                <Tabs
                  value={groupTab}
                  onChange={(_, v) => setGroupTab(v)}
                  centered
                >
                  <Tab label="Members" />
                  <Tab label="Add Member" />
                  <Tab label="Info" />
                </Tabs>
                <Box sx={{ mt: 2 }}>
                  {groupTab === 0 && (
                    <GroupInfo
                      group={chat}
                      onClose={() => setGroupModalOpen(false)}
                    />
                  )}
                  {groupTab === 1 && (
                    <AddGroupMemberModal
                      groupId={chat._id}
                      onClose={() => setGroupModalOpen(false)}
                      onMemberAdded={() => setGroupModalOpen(false)}
                    />
                  )}
                  {groupTab === 2 && (
                    <Box sx={{ p: 2 }}>
                      <strong>Group Name:</strong> {chat.name}
                      <br />
                      <strong>Created:</strong> {chat.createdAt}
                      {/* Add more info as needed */}
                    </Box>
                  )}
                </Box>
              </Box>
            </Dialog>
          )}
        </>
      )}
    </Box>
  );
};

export default ChatWindow;
