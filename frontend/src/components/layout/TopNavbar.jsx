import React from "react";
import {
  CameraAlt,
  Search,
  MoreVert,
  ArrowBack,
  Phone,
  VideoCall,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  useTheme // Import useTheme
} from "@mui/material";

const TopNavbar = ({
  title,
  avatar,
  showBackButton = false,
  onBack,
  onMoreClick,
  moreButtonRef,
  actions, 
}) => {
  const theme = useTheme(); // Use theme hook

  return (
    <AppBar position="fixed" color="primary" elevation={4} sx={{ background: theme.palette.primary.gradient }}> {/* Use primary color and apply gradient */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        {showBackButton ? (
          <>
            <IconButton onClick={onBack} sx={{ color: 'white', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}>
              <ArrowBack fontSize="small" />
            </IconButton>

            <Avatar
              src={avatar || "/default-avatar.png"}
              sx={{ width: 24, height: 24, mr: 1 }}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: "0.95rem",
                maxWidth: 120,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "white", // Set text color to white
              }}
            >
              {title}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            {/* Render custom actions if provided, else default call/video buttons */}
            {actions ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                {React.Children.map(actions, child => (
                  React.cloneElement(child, {
                    sx: { 
                      color: 'white', 
                      transition: 'transform 0.2s ease-in-out', 
                      '&:hover': { transform: 'scale(1.1)' },
                      ...(child.props.sx || {}), // Merge existing sx prop
                    }
                  })
                ))}
              </Box>
            ) : (
              <>
                <IconButton sx={{ color: 'white', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}>
                  <Phone fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: 'white', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}>
                  <VideoCall fontSize="small" />
                </IconButton>
              </>
            )}
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "white" }} // Set text color to white
            >
              {title}
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton sx={{ color: 'white', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}>
                <CameraAlt fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}>
                <Search fontSize="small" />
              </IconButton>
              <IconButton
                ref={moreButtonRef}
                onClick={onMoreClick}
                aria-label="more"
                aria-haspopup="true"
                sx={{ color: 'white', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;