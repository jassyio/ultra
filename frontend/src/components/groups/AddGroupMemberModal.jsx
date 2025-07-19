import { useState } from "react";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import groupService from "../../api/groupService";
import { Modal, Box, Button, TextField, Typography, Alert, CircularProgress, Avatar, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const AddGroupMemberModal = ({ groupId, onClose, onMemberAdded }) => {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [adding, setAdding] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const theme = useTheme();

  const handleCheckEmail = async () => {
    setError("");
    setFoundUser(null);
    const trimmed = email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setError("Enter a valid email.");
      return;
    }
    setChecking(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3001/api/users/check?email=${trimmed}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.exists) {
        setFoundUser(data.user);
      } else {
        setError("User not found. Only registered users can be added.");
      }
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleAddMember = async () => {
    if (!foundUser) return;
    console.log("Adding member with ID:", foundUser.id); // Debug log
    setAdding(true);
    setError("");
    try {
      await groupService.addMember(groupId, foundUser.id);
      setEmail("");
      setFoundUser(null);
      if (onMemberAdded) onMemberAdded();
      setError(""); // Clear any previous errors
      setSuccessMessage("Member added successfully!"); // Set success message
    } catch (err) {
      console.error("Error adding member:", err); // Log the error for debugging
      setError(
        err.response?.data?.message ||
          "Could not add member. Please try again later."
      );
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setFoundUser(null);
    setError("");
    setChecking(false);
    setAdding(false);
    setSuccessMessage(""); // Clear success message on close
    onClose();
  };

  return (
    <Modal open onClose={handleClose}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
        zIndex: 2000,
      }}>
        <Box sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: theme.shadows[6],
          width: '100%',
          maxWidth: 400,
          p: 3,
          position: 'relative',
        }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 12, top: 12, color: theme.palette.text.secondary }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary, textAlign: 'center' }}>
            Add Group Member
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          {!foundUser ? (
            <>
              <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, textAlign: 'center' }}>
                Enter the email of the user you want to add
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="user@email.com"
                  fullWidth
                  size="small"
                  disabled={checking || adding}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCheckEmail();
                    }
                  }}
                  sx={{ bgcolor: theme.palette.background.default, borderRadius: 2 }}
                />
                <Button
                  variant="contained"
                  sx={{
                    minWidth: 44,
                    minHeight: 44,
                    background: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2ebf91 0%, #8360c3 100%)',
                    },
                  }}
                  onClick={handleCheckEmail}
                  disabled={checking || adding}
                >
                  {checking ? <CircularProgress size={20} /> : <FaUserPlus />}
                </Button>
              </Box>
              <Button
                onClick={handleClose}
                sx={{ color: theme.palette.text.secondary, mt: 1 }}
                fullWidth
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center' }}>
                <Avatar src={foundUser.avatar || "/default-avatar.png"} alt={foundUser.name} sx={{ width: 56, height: 56, borderRadius: '50%' }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>{foundUser.name}</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{foundUser.email}</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2ebf91 0%, #8360c3 100%)',
                  },
                }}
                onClick={handleAddMember}
                disabled={adding}
                startIcon={<FaUserPlus />}
              >
                {adding ? <CircularProgress size={20} /> : "Add to Group"}
              </Button>
              <Button
                onClick={handleClose}
                sx={{ color: theme.palette.text.secondary }}
                fullWidth
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AddGroupMemberModal;