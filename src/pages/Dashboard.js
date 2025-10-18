import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Material-UI Imports
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Avatar,
  Stack,
} from "@mui/material";

// Icon Imports
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Import Copy Icon
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    checkUserAndLoadJobs();
  }, []);

  const checkUserAndLoadJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);

    // Fetch jobs AND the count of related applications
    const { data, error } = await supabase
      .from("jobs")
      .select("*, applications(count)") // This is the key change!
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading jobs:", error);
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Helper function to get username from email
  const getUsername = (email) => {
    return email.split("@")[0];
  };

  // Function to copy the public job link
  const copyJobLink = (username, slug) => {
    const link = `${window.location.origin}/apply/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    alert("Public job link copied to clipboard!");
  };

  const handleDeleteJob = async (jobId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this job posting? This action cannot be undone."
      )
    ) {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);
      if (error) {
        alert("Error deleting job: " + error.message);
      } else {
        // Refresh the job list
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
    }
  };

  const renderStatusChip = (status) => {
    const isActive = status === "active";
    return (
      <Chip
        icon={
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isActive ? "success.main" : "text.disabled",
              display: "inline-block",
              ml: "8px !important",
            }}
          />
        }
        label={isActive ? "Active" : "Inactive"}
        variant="outlined"
        size="small"
        sx={{
          borderColor: "transparent",
          backgroundColor: isActive ? "success.light" : "#f0f0f0",
          color: isActive ? "success.dark" : "text.secondary",
          "& .MuiChip-label": { pd: "0 8px 0 2px" },
        }}
      />
    );
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={1}
        sx={{ backgroundColor: "white" }}
      >
        <Toolbar>
          <WorkOutlineIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            JobPost
          </Typography>
          <IconButton
            onClick={handleProfileMenuOpen}
            size="large"
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderProfileMenu}

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1" fontWeight="600">
              Your Job Postings
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/jobs/create")}
              disableElevation
            >
              New Job Posting
            </Button>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead
                sx={{
                  "& .MuiTableCell-root": {
                    color: "text.secondary",
                    fontWeight: "600",
                  },
                }}
              >
                <TableRow>
                  <TableCell>JOB TITLE</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>APPLICANTS</TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body1" fontWeight="500">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.company_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{renderStatusChip(job.status)}</TableCell>
                    <TableCell>
                      {/* Supabase returns the count in an array */}
                      {job.applications[0]?.count || 0}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          title="Copy Public Link"
                          size="small"
                          onClick={() =>
                            copyJobLink(getUsername(user.email), job.slug)
                          }
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          title="View Applications"
                          size="small"
                          onClick={() =>
                            navigate(`/jobs/${job.id}/applications`)
                          }
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          title="Edit Job"
                          size="small"
                          onClick={() => navigate(`/jobs/${job.id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          title="Delete Job"
                          size="small"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;
