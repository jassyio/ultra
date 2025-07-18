import React from 'react';
import { Box, Skeleton } from '@mui/material';

const ChatListItemSkeleton = () => {
  return (
    <Box
      sx={{
        p: 2,
        mb: 1,
        borderRadius: 1,
        backgroundColor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        height: 72, // Approximate height of a chat list item
      }}
    >
      <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="80%" height={16} sx={{ mt: 0.5 }} />
      </Box>
      <Skeleton variant="text" width={40} height={16} />
    </Box>
  );
};

export default ChatListItemSkeleton; 