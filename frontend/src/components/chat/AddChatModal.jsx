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
} from "@mui/material";
import axios from "axios";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

export default function AddChatModal({ open, onClose }) {
  const { setChats, setSelectedChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("input"); // input → found → invite
  const [foundUser, setFoundUser] = useState(null);
  const [saved, setSaved] = useState(null);       // null / true / false
  const [error, setError] = useState("");

  const reset = () => {
    setEmail("");
    setPhase("input");
    setFoundUser(null);
    setSaved(null);
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
      const { data } = await axios.get(
        `http://localhost:3001/api/users/check?email=${trimmed}`
      );
      setLoading(false);
      if (data.exists) {
        if (data.user.id === user.id) {
          setError("You can’t chat with yourself.");
        } else {
          setFoundUser(data.user);
          setPhase("found");
        }
      } else {
        setPhase("invite");
      }
    } catch {
      setLoading(false);
      setError("Server error. Try again.");
    }
  };

  const handleSaveContact = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:3001/api/contacts", {
        userId: foundUser.id,
      });
      setSaved(true);
    } catch {
      setError("Could not save contact. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDontSaveContact = () => {
    setSaved(false);
  };

  const handleStartChat = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3001/api/chats", {
        userId: foundUser.id,
      });
      // assume data.chat is the created chat
      setChats((prev) => [...prev, data.chat]);
      setSelectedChat(data.chat);
      handleClose();
    } catch {
      setError("Could not start chat. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = () => {
    alert(`Invitation sent to ${email}`);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500, sx: { zIndex: 5 } }}
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
            zIndex: 10,
          }}
        >
          {phase === "input" && (
            <>
              <Typography variant="h6" mb={2}>
                Start New Chat
              </Typography>
              <TextField
                fullWidth
                label="Enter user email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                disabled={loading}
              />
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Button fullWidth variant="contained" onClick={checkEmail}>
                  Check User
                </Button>
              )}
            </>
          )}

          {phase === "found" && foundUser && (
            <>
              <Typography mb={2}>
                User found: <strong>{foundUser.name}</strong>
              </Typography>

              {/* Save / Don't Save */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Button
                  variant={saved === true ? "contained" : "outlined"}
                  onClick={handleSaveContact}
                  disabled={loading}
                >
                  Save Contact
                </Button>
                <Button
                  variant={saved === false ? "contained" : "outlined"}
                  onClick={handleDontSaveContact}
                >
                  Don't Save
                </Button>
              </Box>

              {/* Start Chat / Cancel */}
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Box display="flex" flexDirection="column" gap={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleStartChat}
                    disabled={saved === null}
                  >
                    Start Chat
                  </Button>
                  <Button fullWidth color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                </Box>
              )}

              {error && (
                <Typography color="error" mt={1}>
                  {error}
                </Typography>
              )}
            </>
          )}

          {phase === "invite" && (
            <>
              <Typography mb={2}>
                User not found. Invite <strong>{email}</strong>?
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Button variant="contained" onClick={inviteUser}>
                  Invite
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
              {error && (
                <Typography color="error" mt={1}>
                  {error}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
