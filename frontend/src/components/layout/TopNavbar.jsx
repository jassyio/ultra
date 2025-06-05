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
} from "@mui/material";

const TopNavbar = ({
  title,
  avatar,
  showBackButton = false,
  onBack,
  onMoreClick,
  moreButtonRef,
}) => {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
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
            <IconButton onClick={onBack}>
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
              }}
            >
              {title}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <IconButton>
              <Phone fontSize="small" />
            </IconButton>
            <IconButton>
              <VideoCall fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {title}
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton>
                <CameraAlt fontSize="small" />
              </IconButton>
              <IconButton>
                <Search fontSize="small" />
              </IconButton>
              <IconButton
                ref={moreButtonRef}
                onClick={onMoreClick}
                aria-label="more"
                aria-haspopup="true"
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