import React, { useState } from 'react';
import StatusList from '../updates/StatusList';
import StatusView from '../updates/StatusView';
import { Avatar, Button, Box, Typography, Modal, useTheme } from '@mui/material';

// Mock data for demonstration
const mockInitialStatuses = [
  {
    id: 0,
    name: 'You',
    avatar: '/public/avatars/your-avatar.png',
    message: 'Tap to add status update',
    time: '',
    isOwn: true,
    seen: true,
    items: [
      { type: 'text', content: 'Your status here!', createdAt: Date.now() }
    ]
  },
  {
    id: 1,
    name: 'John Doe',
    avatar: '/public/avatars/john.png',
    message: 'Enjoying the weekend! 🌴',
    time: '2h ago',
    seen: false,
    items: [
      { type: 'text', content: 'Enjoying the weekend! 🌴', createdAt: Date.now() - 2 * 60 * 60 * 1000 }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: '/public/avatars/jane.png',
    message: 'Just finished a great book! 📚',
    time: '5h ago',
    seen: true,
    items: [
      { type: 'text', content: 'Just finished a great book! 📚', createdAt: Date.now() - 5 * 60 * 60 * 1000 }
    ]
  },
  {
    id: 3,
    name: 'Mike Ross',
    avatar: '/public/avatars/mike.png',
    message: 'What a game! ⚽🔥',
    time: '10h ago',
    seen: false,
    items: [
      { type: 'text', content: 'What a game! ⚽🔥', createdAt: Date.now() - 10 * 60 * 60 * 1000 }
    ]
  }
];

const UpdatesPage = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusViewOpen, setStatusViewOpen] = useState(false);
  const [currentStatusUserIndex, setCurrentStatusUserIndex] = useState(0);
  const [statuses, setStatuses] = useState(mockInitialStatuses); // Use useState for mockStatuses
  const theme = useTheme();

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setStatusViewOpen(true);
    // Find the index of the clicked status user
    const index = statuses.findIndex(s => s.id === status.id);
    if (index !== -1) {
      setCurrentStatusUserIndex(index);
    }
  };

  const handleCloseStatusView = () => {
    setStatusViewOpen(false);
    setSelectedStatus(null);
    setCurrentStatusUserIndex(0); // Reset index when closing
  };

  const handleNextUserStatus = () => {
    const nextIndex = currentStatusUserIndex + 1;
    if (nextIndex < statuses.length) {
      setSelectedStatus(statuses[nextIndex]);
      setCurrentStatusUserIndex(nextIndex);
    } else {
      handleCloseStatusView(); // No more users, close the status view
    }
  };

  const handlePrevUserStatus = () => {
    const prevIndex = currentStatusUserIndex - 1;
    if (prevIndex >= 0) {
      setSelectedStatus(statuses[prevIndex]);
      setCurrentStatusUserIndex(prevIndex);
    } else {
      handleCloseStatusView(); // No previous users, close the status view
    }
  };

  // Handle adding a new status
  const handleAddStatus = (newStatusContent) => {
    const newStatusItem = {
      type: newStatusContent.media ? (newStatusContent.media.type.startsWith('image') ? 'image' : 'video') : 'text',
      content: newStatusContent.text,
      mediaUrl: newStatusContent.preview, // For mock, use the preview as mediaUrl
      createdAt: Date.now(),
    };

    setStatuses(prevStatuses => {
      const updatedStatuses = [...prevStatuses];
      const ownStatusIndex = updatedStatuses.findIndex(s => s.isOwn);

      if (ownStatusIndex !== -1) {
        // If own status already exists, add new item to it
        const ownStatus = { ...updatedStatuses[ownStatusIndex] };
        ownStatus.items = [...ownStatus.items, newStatusItem];
        ownStatus.message = newStatusContent.text || (newStatusContent.media ? (newStatusContent.media.type.startsWith('image') ? 'New image update' : 'New video update') : 'New update');
        ownStatus.time = 'Just now';
        updatedStatuses[ownStatusIndex] = ownStatus;
      } else {
        // If no own status, create a new one
        const newOwnStatus = {
          id: Math.max(...prevStatuses.map(s => s.id)) + 1, // Generate a unique ID
          name: 'You',
          avatar: '/public/avatars/your-avatar.png',
          message: newStatusContent.text || (newStatusContent.media ? (newStatusContent.media.type.startsWith('image') ? 'New image update' : 'New video update') : 'New update'),
          time: 'Just now',
          isOwn: true,
          seen: false, // Mark as unseen for others for now
          items: [newStatusItem],
        };
        updatedStatuses.unshift(newOwnStatus); // Add to the beginning
      }
      return updatedStatuses;
    });
  };

  // Separate own status and others
  const ownStatus = statuses.find(s => s.isOwn); // Use statuses state
  const otherStatuses = statuses.filter(s => !s.isOwn); // Use statuses state

  return (
    <Box sx={{ maxWidth: 480, margin: '0 auto', px: 0, pt: { xs: '56px', sm: '64px' }, pb: '64px', bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Your own status */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
        <Avatar src={ownStatus.avatar} alt="Your avatar" sx={{ width: 56, height: 56, mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>My Status</Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{ownStatus.message}</Typography>
        </Box>
        <Button variant="contained" size="small" sx={{ ml: 2 }}>
          + Add
        </Button>
      </Box>

      {/* Recent updates */}
      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1, mt: 2 }}>
        Recent updates
      </Typography>
      <Box>
        {otherStatuses.map(status => (
          <Box
            key={status.id}
            sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', opacity: status.seen ? 0.6 : 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, px: 2, py: 1 }}
            onClick={() => handleStatusClick(status)}
          >
            <Avatar src={status.avatar} alt={status.name} sx={{ width: 48, height: 48, mr: 2, border: status.seen ? '2px solid #bbb' : `2px solid ${theme.palette.primary.main}` }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={status.seen ? 'normal' : 'bold'} sx={{ color: theme.palette.text.primary }}>{status.name}</Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{status.message}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>{status.time}</Typography>
          </Box>
        ))}
      </Box>

      {/* Status view modal (mock) */}
      <Modal open={statusViewOpen} onClose={handleCloseStatusView}>
        <Box>
          {selectedStatus && (
            <StatusView
              status={selectedStatus}
              onClose={handleCloseStatusView}
              onNextUser={handleNextUserStatus}
              onPrevUser={handlePrevUserStatus}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdatesPage;