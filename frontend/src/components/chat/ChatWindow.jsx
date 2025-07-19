import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import { Box, IconButton, Tooltip, Dialog, Tabs, Tab, Typography, Button, Avatar, Divider } from "@mui/material";
import Message from "./Message";
import MessageInput from "./MessageInput";
import TopNavbar from "../layout/TopNavbar";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleIcon from "@mui/icons-material/People";
import CallIcon from "@mui/icons-material/Call";
import AddGroupMemberModal from "../groups/AddGroupMemberModal";
import GroupInfo from "../groups/GroupInfo";
import GroupManagementModal from "../groups/GroupManagementModal"; // Added import for GroupManagementModal
import { useTheme } from "@mui/material/styles";
import { Search, MoreVert } from "@mui/icons-material";
import CallInterface from "../calls/CallInterface";
import Videocam from "@mui/icons-material/Videocam";
import axios from "axios";
import MessageSkeleton from "./MessageSkeleton"; // Import MessageSkeleton
import CloseIcon from '@mui/icons-material/Close';

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
    loadingMessages, // Get loadingMessages state
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket, isConnected, incomingCall, setIncomingCall } = useContext(SocketContext);

  const messagesEndRef = useRef(null);

  // Remove old modal/tab state and debug
  // Add clean state for new modals
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [callActive, setCallActive] = useState(false); // New state for call active
  const [isVideoCall, setIsVideoCall] = useState(false); // State to toggle between voice and video calls

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessagesForChat(selectedChat._id);
    }
  }, [selectedChat?._id, fetchMessagesForChat]); // Add fetchMessagesForChat to dependencies

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
        <Box>
          <TopNavbar
            title={chatTitle}
            avatar={chatAvatar}
            showBackButton={!!selectedChat}
            onBack={() => setSelectedChat(null)}
            actions={
              isGroup ? (
                <Box>
                  {/* Group Info Icon */}
                  <Tooltip title="Group Info">
                    <IconButton
                      onClick={() => setGroupInfoOpen(true)} // Open group info modal
                    >
                      <PeopleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Add Member Icon */}
                  <Tooltip title="Add Member">
                    <IconButton
                      onClick={() => setAddMemberOpen(true)} // Open add member modal
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
                </Box>
              ) : (
                <Box>
                  <Tooltip title="Search Chat">
                    <IconButton>
                      <Search fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Start Call">
                    <IconButton
                      onClick={() => {
                        setCallActive(true);
                        setIsVideoCall(false);
                      }}
                    >
                      <CallIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Start Video Call">
                    <IconButton
                      onClick={() => {
                        setCallActive(true);
                        setIsVideoCall(true);
                      }}
                    >
                      <Videocam fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More Options">
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }
          />

          <Box sx={{ flex: 1, overflowY: "auto", p: 1, position: 'relative', pb: 10 }}>
            {loadingMessages ? (
              Array.from(new Array(10)).map((_, index) => (
                <MessageSkeleton key={index} isOwn={index % 2 === 0} />
              ))
            ) : (
              chatMessages.map((message, index) => (
                <Message
                  key={message._id || index}
                  message={message}
                  isOwnMessage={message.sender === user?.id}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>

          <MessageInput chatId={selectedChat._id} onSendMessage={handleSendMessage} />

          {/* Group Info Modal */}
          <Dialog open={groupInfoOpen} onClose={() => setGroupInfoOpen(false)} maxWidth="xs" fullWidth>
            <Box sx={{ p: 3, bgcolor: theme => theme.palette.background.paper, position: 'relative' }}>
              <IconButton onClick={() => setGroupInfoOpen(false)} sx={{ position: 'absolute', top: 8, right: 8, color: theme => theme.palette.text.secondary }}>
                <CloseIcon />
              </IconButton>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={chat?.avatar || "/default-group-avatar.png"}
                    sx={{
                      width: 88,
                      height: 88,
                      borderRadius: '50%',
                      background: theme => theme.palette.background.paper,
                      border: theme => `2px solid ${theme.palette.background.paper}`,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme => theme.palette.text.primary }}>{chat?.name || 'Group'}</Typography>
                {chat?.description && (
                  <Typography variant="body2" sx={{ color: theme => theme.palette.text.secondary, mt: 1, textAlign: 'center' }}>{chat.description}</Typography>
                )}
                <Typography variant="caption" sx={{ color: theme => theme.palette.text.secondary, mt: 1 }}>
                  Created by {chat?.creator?.name || 'Unknown'} on {chat?.createdAt ? new Date(chat.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme => theme.palette.text.primary, mb: 1 }}>Members</Typography>
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {Array.isArray(chat?.members) && chat.members.length > 0 ? (
                  chat.members.map(member => (
                    <Box key={member._id} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <Avatar src={member?.user?.avatar || "/default-avatar.png"} sx={{ width: 32, height: 32, mr: 1, borderRadius: '50%' }} />
                      <Typography variant="body2" sx={{ color: theme => theme.palette.text.primary, fontWeight: 500 }}>{member?.user?.name || 'Unknown'}</Typography>
                      {member?.isAdmin && (
                        <Box sx={{ ml: 1, px: 1, borderRadius: 1, fontSize: 12, fontWeight: 'bold', background: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)', color: '#fff', letterSpacing: 0.5 }}>admin</Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: theme => theme.palette.text.secondary }}>No members</Typography>
                )}
              </Box>
            </Box>
          </Dialog>
          {/* Add Member Modal */}
          <Dialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} maxWidth="xs" fullWidth>
            <AddGroupMemberModal groupId={selectedChat?._id} onClose={() => setAddMemberOpen(false)} />
          </Dialog>
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;
