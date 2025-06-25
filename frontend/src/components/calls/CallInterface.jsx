import React, { useState, useEffect } from "react";
import { Avatar, IconButton, Box, Typography, Button } from "@mui/material";
import { Mic, MicOff, Videocam, Speaker, Chat, CallEnd } from "@mui/icons-material";

const CallInterface = ({ participants, groupName, groupAvatar, isVideoCall, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideo, setIsVideo] = useState(isVideoCall); // Initialize with the isVideoCall prop

  useEffect(() => {
    console.log(isVideo ? "Starting video call..." : "Starting voice call...");
  }, [isVideo]);

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
        bgcolor: "#3a3a3a", // Plain gray background
        backgroundImage: `
          radial-gradient(circle, #3a3a3a 20%, #4a4a4a 40%, #3a3a3a 60%),
          linear-gradient(45deg, #3a3a3a 25%, #4a4a4a 25%, #4a4a4a 50%, #3a3a3a 50%)
        `,
        backgroundSize: "cover",
        color: "white",
        padding: 2,
      }}
    >
      {/* Profile Picture */}
      <Avatar
        src={participants.length > 1 ? groupAvatar || "/default-group-avatar.png" : participants[0]?.avatar || "/default-avatar.png"}
        alt={participants.length > 1 ? groupName || "Group" : participants[0]?.name || "Participant"}
        sx={{ width: 100, height: 100, marginTop: 1 }}
      />

      {/* Name and Status */}
      <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 1 }}>
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
          <Videocam fontSize="large" />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 1 }}>
        <IconButton onClick={handleMuteToggle} sx={{ color: "white" }}>
          {isMuted ? <MicOff fontSize="large" /> : <Mic fontSize="large" />}
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Chat fontSize="large" />
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