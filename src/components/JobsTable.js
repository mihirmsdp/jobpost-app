import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function JobsTable({
  jobs,
  onViewApplications,
  onEditJob,
  onDeleteJob,
  onCopyLink,
}) {
  const renderStatusChip = (status) => {
    const isActive = status === "active";
    return (
      <Chip
        icon={
          <FiberManualRecordIcon
            sx={{
              fontSize: 10,
              color: isActive ? "#4caf50" : "#9e9e9e",
            }}
          />
        }
        label={isActive ? "Active" : "Inactive"}
        size="small"
        sx={{
          height: 24,
          fontSize: "0.75rem",
          bgcolor: isActive ? "#e8f5e9" : "#f5f5f5",
          color: isActive ? "#2e7d32" : "#757575",
          border: "none",
          fontWeight: 500,
        }}
      />
    );
  };

  const renderApplicantAvatars = (count) => {
    if (count === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          0
        </Typography>
      );
    }

    // Generate mock avatars for visual effect
    const avatarCount = Math.min(count, 3);
    const avatars = Array.from({ length: avatarCount }, (_, i) => (
      <Avatar
        key={i}
        sx={{
          width: 28,
          height: 28,
          fontSize: "0.75rem",
          bgcolor: `hsl(${(i * 137) % 360}, 60%, 60%)`,
        }}
      >
        {String.fromCharCode(65 + i)}
      </Avatar>
    ));

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AvatarGroup
          max={3}
          sx={{ "& .MuiAvatar-root": { width: 28, height: 28 } }}
        >
          {avatars}
        </AvatarGroup>
        {count > 3 && (
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            +{count - 3}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Recent Jobs
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#fafafa",
                "& .MuiTableCell-root": {
                  py: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                },
              }}
            >
              <TableCell>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  JOB TITLE
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  APPLICANTS
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  STATUS
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  LOCATION
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  ACTIONS
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job.id}
                sx={{
                  "&:hover": { bgcolor: "#fafafa" },
                  "& .MuiTableCell-root": { py: 2 },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {job.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {job.company_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {renderApplicantAvatars(job.applications[0]?.count || 0)}
                </TableCell>
                <TableCell>{renderStatusChip(job.status)}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="flex-end"
                  >
                    <IconButton
                      size="small"
                      onClick={() => onCopyLink(job)}
                      sx={{
                        "&:hover": { bgcolor: "#f5f5f5" },
                      }}
                    >
                      <ContentCopyIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onViewApplications(job.id)}
                      sx={{
                        "&:hover": { bgcolor: "#f5f5f5" },
                      }}
                    >
                      <VisibilityIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onEditJob(job.id)}
                      sx={{
                        "&:hover": { bgcolor: "#f5f5f5" },
                      }}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteJob(job.id)}
                      sx={{
                        "&:hover": { bgcolor: "#ffebee" },
                        color: "#d32f2f",
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {jobs.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="body2" color="text.secondary">
            No jobs posted yet
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default JobsTable;
