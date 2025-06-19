import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../../context/AuthContext';

const MessageContainer = styled(Box)(({ theme, 'data-is-own': isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const MessageBubble = styled(Box)(({ theme, 'data-is-own': isOwn }) => ({
  maxWidth: '65%',
  padding: theme.spacing(1, 1.5),
  borderRadius: isOwn
    ? `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(2)}`
    : `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(1)}`,
  backgroundColor: isOwn ? '#e7ffdb' : '#fff',
  color: '#111b21',
  position: 'relative',
  wordBreak: 'break-word',
  boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
}));

const TimeStamp = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  fontSize: '11px',
  color: '#667781',
  position: 'absolute',
  right: 8,
  bottom: 4,
  background: 'transparent',
});

const Message = ({ message, isOwnMessage, isPending = false }) => {
  const { user } = useContext(AuthContext);
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const own =
    user &&
    (message.sender === user.id ||
      (typeof message.sender === "object" && message.sender._id === user.id));

  return (
    <MessageContainer data-is-own={own}>
      <MessageBubble data-is-own={own}>
        <Typography
          component="span"
          sx={{
            fontSize: '14px',
            lineHeight: '19px',
            whiteSpace: 'pre-wrap',
            display: 'block',
            paddingRight: '38px', // space for timestamp and ticks
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


