import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Avatar, IconButton, LinearProgress, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const StatusView = ({ status, onClose, onNextUser, onPrevUser }) => {
  const [currentStatusItemIndex, setCurrentStatusItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const statusItem = status.items[currentStatusItemIndex];

  const STATUS_DURATION = 5000; // 5 seconds per status item for mock

  // Handle automatic progression
  useEffect(() => {
    if (!status) return;

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          // Current status item finished
          if (currentStatusItemIndex < status.items.length - 1) {
            setCurrentStatusItemIndex((prevIndex) => prevIndex + 1);
            return 0; // Reset progress for next item
          } else {
            // Last status item of current user finished
            onNextUser(); // Go to next user's status
            return 0; // Reset progress
          }
        }
        return prevProgress + (100 / (STATUS_DURATION / 100)); // Increment progress
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [status, currentStatusItemIndex, onNextUser]);

  // Reset progress and item index when status changes (new user or re-opening)
  useEffect(() => {
    setCurrentStatusItemIndex(0);
    setProgress(0);
  }, [status]);

  const handleTap = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 2) {
      // Left half: previous status item
      if (currentStatusItemIndex > 0) {
        setCurrentStatusItemIndex(prevIndex => prevIndex - 1);
        setProgress(0); // Reset progress for new item
      } else {
        // First item, go to previous user's status
        onPrevUser();
      }
    } else {
      // Right half: next status item
      if (currentStatusItemIndex < status.items.length - 1) {
        setCurrentStatusItemIndex(prevIndex => prevIndex + 1);
        setProgress(0); // Reset progress for new item
      } else {
        // Last item, go to next user's status
        onNextUser();
      }
    }
  }, [currentStatusItemIndex, status?.items.length, onNextUser, onPrevUser]);

  if (!status) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        zIndex: 9999,
        overflow: 'hidden',
      }}
      onClick={handleTap}
    >
      {/* Progress Bar */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'flex', p: 0.5, zIndex: 10 }}>
        {status.items.map((_, idx) => (
          <LinearProgress
            key={idx}
            variant="determinate"
            value={idx === currentStatusItemIndex ? progress : (idx < currentStatusItemIndex ? 100 : 0)}
            sx={{
              flexGrow: 1,
              height: 3,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { bgcolor: 'white' },
              mx: 0.25,
            }}
          />
        ))}
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 4, zIndex: 10 }}>
        <Avatar src={status.avatar} alt={status.name} sx={{ width: 40, height: 40, mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{status.name}</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        {statusItem.type === 'text' && (
          <Typography variant="h5" textAlign="center">{statusItem.content}</Typography>
        )}
        {/* Add image/video handling here later */}
      </Box>

      {/* Navigation Areas (Invisible) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          cursor: 'w-resize',
          zIndex: 5, // Behind header but above content for taps
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          cursor: 'e-resize',
          zIndex: 5, // Behind header but above content for taps
        }}
      />
    </Box>
  );
};

export default StatusView;
