import React from 'react';
import { Box, Skeleton } from '@mui/material';

const MessageSkeleton = ({ isOwn = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: 0.5,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: '65%',
          padding: 1.5,
          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isOwn ? '#e7ffdb' : '#fff',
          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start',
        }}
      >
        <Skeleton variant="text" width={Math.random() * 150 + 100} height={20} />
        <Skeleton variant="text" width={Math.random() * 100 + 50} height={16} sx={{ mt: 0.5 }} />
      </Box>
    </Box>
  );
};

export default MessageSkeleton; 