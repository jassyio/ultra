import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircularProgress from '@mui/material/CircularProgress';

const MessageContainer = styled(Box)(({ theme, 'data-is-own': isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(0.5),
  position: 'relative',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const MessageBubble = styled(Box)(({ theme, 'data-is-own': isOwn }) => ({
  maxWidth: '65%',
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: isOwn ? '#e7ffdb' : '#fff',
  color: '#111b21',
  position: 'relative',
  wordBreak: 'break-word',
  boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
}));

const TimeStamp = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  fontSize: '11px',
  color: '#667781',
  float: 'right',
  marginLeft: '4px',
  marginTop: '2px',
});

const Message = ({ message, isOwnMessage, isPending = false }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <MessageContainer data-is-own={isOwnMessage}>
      <MessageBubble data-is-own={isOwnMessage}>
        <Typography 
          component="span" 
          sx={{ 
            fontSize: '14px',
            lineHeight: '19px',
            whiteSpace: 'pre-wrap'
          }}
        >
          {message.content}
        </Typography>
        <TimeStamp>
          {formattedTime}
          {isOwnMessage && (
            isPending ? (
              <CircularProgress
                size={11}
                thickness={5}
                sx={{
                  color: '#667781',
                  marginLeft: '2px',
                }}
              />
            ) : message.isRead ? (
              <DoneAllIcon sx={{ fontSize: 15, color: '#53bdeb' }} />
            ) : (
              <CheckIcon sx={{ fontSize: 15, color: '#667781' }} />
            )
          )}
        </TimeStamp>
      </MessageBubble>
    </MessageContainer>
  );
};

export default Message;
