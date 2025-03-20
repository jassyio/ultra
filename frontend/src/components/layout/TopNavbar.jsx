import { CameraAlt, Search, MoreVert } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";

const TopNavbar = ({ title }) => {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        {/* Dynamic Title (Chat, Updates, Calls, etc.) */}
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          {title}
        </Typography>

        {/* Icons with proper spacing */}
        <Box sx={{ display: "flex", gap: 2 }}>  
          <IconButton>
            <CameraAlt fontSize="small" />
          </IconButton>
          <IconButton>
            <Search fontSize="small" />
          </IconButton>
          <IconButton>
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
