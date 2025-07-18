import React, { useContext } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
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

const MessageBubble = styled(Box)(({ theme, 'data-is-own': isOwn }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    maxWidth: '65%',
    padding: theme.spacing(1, 1.5),
    borderRadius: isOwn
      ? `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(2)}`
      : `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(1)}`,
    backgroundColor: isOwn
      ? (isDark ? 'rgba(46,191,145,0.12)' : '#e7ffdb')
      : theme.palette.background.paper,
    color: theme.palette.text.primary,
    position: 'relative',
    wordBreak: 'break-word',
    boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
    alignSelf: isOwn ? 'flex-end' : 'flex-start',
  };
});

const TimeStamp = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  fontSize: '11px',
  color: theme.palette.text.secondary,
  position: 'absolute',
  right: 8,
  bottom: 4,
  background: 'transparent',
}));

const Message = ({ message, isOwnMessage, isPending = false }) => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
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
            paddingRight: '38px',
            color: theme.palette.text.primary,
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
                  color: theme.palette.text.secondary,
                  marginLeft: '2px',
                }}
              />
            ) : message.isRead ? (
              <DoneAllIcon sx={{ fontSize: 15, color: theme.palette.primary.main }} />
            ) : (
              <CheckIcon sx={{ fontSize: 15, color: theme.palette.text.secondary }} />
            )
          )}
        </TimeStamp>
      </MessageBubble>
    </MessageContainer>
  );
};

export default Message;


