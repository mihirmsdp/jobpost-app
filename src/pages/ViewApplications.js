import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
  Select,
  MenuItem,
  FormControl,
  Chip,
  Tooltip,
} from "@mui/material";

// Icon Imports
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";

function ViewApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);

    // --- UPDATED LOGIC ---
    // Call the RPC function to securely fetch job and application data
    const { data, error } = await supabase.rpc("get_job_with_applications", {
      job_id_param: jobId,
    });

    if (error || !data) {
      console.error("Error fetching applications via RPC:", error);
      setError("Could not load application data. Please try again.");
    } else {
      setJob(data); // The RPC returns the 'title' directly in the data object
      const sortedApplications = data.applications.sort(
        (a, b) => new Date(b.applied_at) - new Date(a.applied_at)
      );
      setApplications(sortedApplications);
    }
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    fetchApplications();

    // --- Realtime Subscription ---
    const channel = supabase
      .channel(`applications-for-job-${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "applications",
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          setApplications((currentApps) =>
            currentApps.map((app) =>
              app.id === payload.new.id ? payload.new : app
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, fetchApplications]);

  const handleStatusChange = async (applicationId, newStatus) => {
    const originalApplications = [...applications];
    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);

    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", applicationId);

    if (error) {
      console.error("Failed to update status:", error);
      setApplications(originalApplications);
      alert("Failed to update status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
          Go to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
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
            <Box>
              <Typography variant="h5" component="h1" fontWeight="600">
                Applications for "{job?.title}"
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {applications.length} total applicant(s)
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Box>

          {applications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography color="text.secondary">
                No applications have been received for this job posting yet.
              </Typography>
            </Box>
          ) : (
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
                    <TableCell>APPLICANT</TableCell>
                    <TableCell>APPLIED ON</TableCell>
                    <TableCell>AI SCORE</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell align="right">RESUME</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="500">
                          {app.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {app.email}
                        </Typography>
                        {app.ai_summary && (
                          <Tooltip title={app.ai_summary}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.disabled",
                                mt: 0.5,
                                display: "block",
                                fontStyle: "italic",
                              }}
                            >
                              AI Summary available
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(app.applied_at)}</TableCell>
                      <TableCell>
                        {app.ai_score !== null ? (
                          <Chip
                            label={`${app.ai_score}/100`}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Screening...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app.id, e.target.value)
                            }
                          >
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="reviewed">Reviewed</MenuItem>
                            <MenuItem value="interviewing">
                              Interviewing
                            </MenuItem>
                            <MenuItem value="hired">Hired</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          startIcon={<DescriptionIcon />}
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default ViewApplications;
