import { useState, useContext, useRef } from "react";
import {
  Box, TextField, IconButton, Popover, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Divider
} from "@mui/material";
import {
  InsertEmoticon, AttachFile, CameraAlt, Mic, Send, Gif, Image, InsertDriveFile,
  Audiotrack, LocationOn, ContactMail, Poll, Event
} from "@mui/icons-material";
import Picker from "@emoji-mart/react";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";

const emojiMenuOptions = [
  { icon: <InsertEmoticon />, label: "Emoji", type: "emoji" },
  { icon: <Gif />, label: "GIF", type: "gif" },
  { icon: <Image />, label: "Sticker", type: "sticker" }
];

const attachMenuOptions = [
  { icon: <InsertDriveFile />, label: "Document", type: "file" },
  { icon: <CameraAlt />, label: "Camera", type: "camera" },
  { icon: <Image />, label: "Gallery", type: "image" },
  { icon: <Audiotrack />, label: "Audio", type: "audio" },
  { icon: <LocationOn />, label: "Location", type: "location" },
  { icon: <ContactMail />, label: "Contact", type: "contact" },
  { icon: <Poll />, label: "Poll", type: "poll" },
  { icon: <Event />, label: "Event", type: "event" }
];

const MessageInput = ({ chatId, disabled }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [emojiMenuType, setEmojiMenuType] = useState("emoji");
  const [attachAnchor, setAttachAnchor] = useState(null);

  const { isConnected, sendMessage } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const fileInputRef = useRef();
  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const audioInputRef = useRef();
  const cameraInputRef = useRef();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Emoji/GIF/Sticker menu
  const handleEmojiMenuOpen = (e) => setEmojiAnchor(e.currentTarget);
  const handleEmojiMenuClose = () => setEmojiAnchor(null);
  const handleEmojiMenuSwitch = (type) => setEmojiMenuType(type);

  // Attach menu
  const handleAttachMenuOpen = (e) => setAttachAnchor(e.currentTarget);
  const handleAttachMenuClose = () => setAttachAnchor(null);

  // File/image/video/audio input handlers
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaType(type);
    setMediaBlob(file);
    setMediaPreview(URL.createObjectURL(file));
    setMessage(file.name);
    handleAttachMenuClose();
  };

  // Camera handler (photo/video)
  const handleCamera = () => {
    cameraInputRef.current.click();
    handleAttachMenuClose();
  };

  // Voice recording handlers
  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setMediaBlob(blob);
      setMediaType("audio");
      setMediaPreview(URL.createObjectURL(blob));
      setIsRecording(false);
    };
    mediaRecorderRef.current.start();
  };
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  // Send message
  const handleSend = async () => {
    if ((!message.trim() && !mediaBlob) || !isConnected || isSending) return;
    setIsSending(true);
    try {
      if (mediaBlob) {
        const file = new File([mediaBlob], `media.${mediaType === "audio" ? "webm" : mediaType}`, { type: mediaBlob.type });
        const fakeUrl = URL.createObjectURL(file);
        sendMessage(chatId, {
          content: message.trim(),
          attachments: [{ url: fakeUrl, type: mediaType }]
        });
        setMediaBlob(null);
        setMediaType(null);
        setMediaPreview(null);
      } else {
        sendMessage(chatId, { content: message.trim() });
      }
      setMessage("");
    } catch (error) {
      setMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  // Cancel media preview
  const handleCancelMedia = () => {
    setMediaBlob(null);
    setMediaType(null);
    setMediaPreview(null);
    setMessage("");
    setIsRecording(false);
  };

  // Emoji picker add
  const handleEmojiSelect = (emoji) => setMessage((msg) => msg + emoji.native);

  return (
    <Box sx={{
      display: "flex",
      alignItems: "flex-end",
      p: 1,
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper"
    }}>
      {/* Emoji/GIF/Sticker */}
      <IconButton
        aria-label="emoji"
        onClick={handleEmojiMenuOpen}
        disabled={disabled || !isConnected}
        sx={{ mr: 0.5 }}
      >
        <InsertEmoticon />
      </IconButton>
      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={handleEmojiMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
          {emojiMenuOptions.map(opt => (
            <IconButton
              key={opt.type}
              color={emojiMenuType === opt.type ? "primary" : "default"}
              onClick={() => handleEmojiMenuSwitch(opt.type)}
            >
              {opt.icon}
            </IconButton>
          ))}
        </Box>
        <Divider />
        <Box sx={{ minWidth: 320, minHeight: 350 }}>
          {emojiMenuType === "emoji" && (
            <Picker onEmojiSelect={handleEmojiSelect} theme="light" />
          )}
          {emojiMenuType === "gif" && (
            <Box sx={{ p: 2, textAlign: "center" }}>GIF picker coming soon</Box>
          )}
          {emojiMenuType === "sticker" && (
            <Box sx={{ p: 2, textAlign: "center" }}>Sticker picker coming soon</Box>
          )}
        </Box>
      </Popover>

      {/* Input area */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        flex: 1,
        borderRadius: 20,
        bgcolor: "#f0f2f5",
        px: 1,
        mr: 1,
        minHeight: 48
      }}>
        {/* Media preview */}
        {mediaPreview && (
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
            {mediaType === "image" && (
              <img src={mediaPreview} alt="preview" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
            )}
            {mediaType === "video" && (
              <video src={mediaPreview} controls style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
            )}
            {mediaType === "audio" && (
              <Audiotrack color="primary" />
            )}
            <IconButton size="small" onClick={handleCancelMedia}>✕</IconButton>
          </Box>
        )}
        <TextField
          variant="standard"
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={isConnected ? "Message" : "Connecting..."}
          disabled={disabled || !isConnected || isRecording}
          InputProps={{
            disableUnderline: true,
            sx: { px: 1, py: 1 }
          }}
          sx={{
            flex: 1,
            bgcolor: "transparent",
            "& .MuiInputBase-input": { fontSize: 16 }
          }}
        />

        {/* Attach */}
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={e => handleFileChange(e, "file")}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={imageInputRef}
          onChange={e => handleFileChange(e, "image")}
        />
        <input
          type="file"
          accept="video/*"
          hidden
          ref={videoInputRef}
          onChange={e => handleFileChange(e, "video")}
        />
        <input
          type="file"
          accept="audio/*"
          hidden
          ref={audioInputRef}
          onChange={e => handleFileChange(e, "audio")}
        />
        <input
          type="file"
          accept="image/*,video/*"
          capture="environment"
          hidden
          ref={cameraInputRef}
          onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            setMediaType(file.type.startsWith("image") ? "image" : "video");
            setMediaBlob(file);
            setMediaPreview(URL.createObjectURL(file));
            setMessage(file.name);
          }}
        />
        <IconButton
          aria-label="attach"
          onClick={handleAttachMenuOpen}
          disabled={disabled || !isConnected}
        >
          <AttachFile />
        </IconButton>
        <Popover
          open={Boolean(attachAnchor)}
          anchorEl={attachAnchor}
          onClose={handleAttachMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <List dense>
            {attachMenuOptions.map(opt => (
              <ListItem
                button
                key={opt.label}
                onClick={() => {
                  if (opt.type === "file") fileInputRef.current.click();
                  else if (opt.type === "image") imageInputRef.current.click();
                  else if (opt.type === "video") videoInputRef.current.click();
                  else if (opt.type === "audio") audioInputRef.current.click();
                  else if (opt.type === "camera") cameraInputRef.current.click();
                  else alert(`${opt.label} feature coming soon!`);
                  handleAttachMenuClose();
                }}
              >
                <ListItemIcon>{opt.icon}</ListItemIcon>
                <ListItemText primary={opt.label} />
              </ListItem>
            ))}
          </List>
        </Popover>

        {/* Camera */}
        <IconButton
          aria-label="camera"
          onClick={handleCamera}
          disabled={disabled || !isConnected}
        >
          <CameraAlt />
        </IconButton>
      </Box>

      {/* Mic/Send (outside input area, right-aligned) */}
      {(!message.trim() && !mediaBlob && !isRecording) ? (
        <IconButton
          color={isRecording ? "secondary" : "primary"}
          aria-label="mic"
          disabled={disabled || !isConnected}
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
        >
          <Mic />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          aria-label="send"
          onClick={handleSend}
          disabled={(!message.trim() && !mediaBlob) || !isConnected || isSending || disabled}
        >
          {isSending ? <CircularProgress size={24} /> : <Send />}
        </IconButton>
      )}
    </Box>
  );
};

export default MessageInput;