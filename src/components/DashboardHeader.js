import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";

function DashboardHeader({ user, onLogout, onNewJob }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ px: 4 }}>
        <WorkOutlineIcon
          sx={{ mr: 1.5, color: "primary.main", fontSize: 28 }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, color: "text.primary" }}
        >
          JobPost
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewJob}
          disableElevation
          sx={{
            mr: 2,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          New Job
        </Button>

        <IconButton onClick={handleMenuOpen} size="medium">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
            }}
          >
            <AccountCircleIcon />
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ mt: 1 }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardHeader;
