import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  Avatar, 
  Typography, 
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

const ProfilePreview = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  
  const handleViewFullProfile = () => {
    onClose();
    navigate(`/profile/${user._id}`);
  };
  
  if (!user) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogContent sx={{ padding: 0, position: 'relative' }}>
        <IconButton 
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.3)', color: '#fff' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar 
            src={user.profilePic || ""} 
            sx={{ 
              width: 200, 
              height: 200, 
              mb: 2,
              cursor: 'pointer'
            }}
            onClick={handleViewFullProfile}
          >
            {!user.profilePic && <PersonIcon fontSize="large" />}
          </Avatar>
          
          <Typography variant="h6" gutterBottom>
            {user.name || "Unknown User"}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user.bio || "No bio available"}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Typography 
              variant="button" 
              sx={{ 
                cursor: 'pointer', 
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={handleViewFullProfile}
            >
              View full profile
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePreview;