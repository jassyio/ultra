import React, { useState, useEffect } from "react";
import { Avatar, IconButton, Box, Typography, Button, useTheme } from "@mui/material";
import { Mic, MicOff, Videocam, VideocamOff, Speaker, CallEnd } from "@mui/icons-material";
import io from "socket.io-client";

const socket = io(import.meta.env.MODE === "production" ? "https://ultra-3il5.onrender.com" : "http://localhost:3001"); // Adjust the URL to your server

const CallInterface = ({ participants, groupName, groupAvatar, isVideoCall, onEndCall }) => {
  const theme = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideo, setIsVideo] = useState(isVideoCall); // Initialize with the isVideoCall prop

  useEffect(() => {
    console.log(isVideo ? "Starting video call..." : "Starting voice call...");
  }, [isVideo]);

  useEffect(() => {
    if (participants && participants.length > 0) {
      const caller = { name: "Current User", socketId: socket.id }; // Replace with actual user data
      const callType = isVideo ? "video" : "voice";

      socket.emit("startCall", {
        callType,
        participants,
        caller,
      });
      console.log("📞 Emitting startCall event:", { callType, participants, caller });
    }
  }, [participants, isVideo]);

  useEffect(() => {
    socket.on("callIncoming", ({ callType, caller }) => {
      console.log(`Incoming ${callType} call from ${caller.name}`);
      alert(`Incoming ${callType} call from ${caller.name}`);
    });

    return () => {
      socket.off("callIncoming");
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Frontend connected to server: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("Frontend disconnected from server");
    });
  }, []);

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
    console.log(isMuted ? "Unmuted" : "Muted");
  };

  const handleSpeakerToggle = () => {
    setIsSpeakerOn((prev) => !prev);
    console.log(isSpeakerOn ? "Speaker Off" : "Speaker On");
  };

  const handleVideoToggle = () => {
    setIsVideo((prev) => !prev);
    console.log(isVideo ? "Video call Off" : "Video call On");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: theme.palette.primary.gradient,
        color: "white",
        padding: 2,
      }}
    >
      {/* Profile Picture */}
      <Avatar
        src={participants.length > 1 ? groupAvatar || "/default-group-avatar.png" : participants[0]?.avatar || "/default-avatar.png"}
        alt={participants.length > 1 ? groupName || "Group" : participants[0]?.name || "Participant"}
        sx={{ width: 120, height: 120, marginTop: 2 }}
      />

      {/* Name and Status */}
      <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 2 }}>
        {participants.length > 1 ? groupName || "Group" : participants[0]?.name || "Participant"}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "gray", marginBottom: 3 }}>
        {participants.length > 1 ? "Group Call..." : "Calling..."}
      </Typography>

      {/* Functional Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
        <IconButton onClick={handleSpeakerToggle} sx={{ color: "white" }}>
          <Speaker fontSize="large" />
        </IconButton>
        <IconButton onClick={handleVideoToggle} sx={{ color: "white" }}>
          {isVideo ? <Videocam fontSize="large" /> : <VideocamOff fontSize="large" />}
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 1 }}>
        <IconButton onClick={handleMuteToggle} sx={{ color: "white" }}>
          {isMuted ? <MicOff fontSize="large" /> : <Mic fontSize="large" />}
        </IconButton>
      </Box>

      {/* End Call Button */}
      <Button
        onClick={onEndCall}
        sx={{
          bgcolor: "red",
          color: "white",
          borderRadius: "50%",
          width: 80,
          height: 80,
          marginBottom: 6,
        }}
      >
        <CallEnd fontSize="large" />
      </Button>
    </Box>
  );
};

export default CallInterface;