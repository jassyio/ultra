// File: src/components/chat/AddChatModal.jsx

import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Backdrop,
  Fade,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

export default function AddChatModal({ open, onClose }) {
  const { createChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("input"); // input → found → invite
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setEmail("");
    setPhase("input");
    setFoundUser(null);
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const checkEmail = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3001/api/users/check?email=${trimmed}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.exists) {
        if (data.user.id === user?.id) {
          setError("You can't chat with yourself.");
        } else {
          setFoundUser(data.user);
          setPhase("found");
        }
      } else {
        setPhase("invite");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    setError("");
    setLoading(true);
    try {
      await createChat(foundUser.id);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start chat. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = () => {
    // TODO: Implement user invitation
    alert(`Invitation sent to ${email}`);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 300,
            maxWidth: "90%",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {phase === "input" && (
            <>
              <Typography variant="h6" mb={2}>
                Start New Chat
              </Typography>
              <TextField
                fullWidth
                label="Enter user email"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !loading) {
                    checkEmail();
                  }
                }}
              />
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={checkEmail}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Check User"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}

          {phase === "found" && foundUser && (
            <>
              <Typography variant="h6" mb={2}>
                User Found
              </Typography>
              <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <img
                  src={foundUser.avatar || "/default-avatar.png"}
                  alt={foundUser.name}
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {foundUser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {foundUser.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleStartChat}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Start Chat"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}

          {phase === "invite" && (
            <>
              <Typography variant="h6" mb={2}>
                User Not Found
              </Typography>
              <Typography mb={3}>
                Would you like to invite {email} to join?
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={inviteUser}
                  disabled={loading}
                >
                  Send Invitation
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
