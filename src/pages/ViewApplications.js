import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Material-UI Imports
import {
  Container, Box, Typography, Button, CircularProgress, Paper, Link,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl
} from '@mui/material';

// Icon Imports
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';

function ViewApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    // Fetch the job title and all its related applications in one call
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        title,
        applications (
          *,
          job_id
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Error fetching applications:', error);
      setError('Could not load application data. Please try again.');
    } else {
      setJob(data);
      // Sort applications by most recent first
      const sortedApplications = data.applications.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
      setApplications(sortedApplications);
    }
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (applicationId, newStatus) => {
    // Optimistically update the UI
    const originalApplications = [...applications];
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);

    // Update the database
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId);

    if (error) {
      console.error('Failed to update status:', error);
      // Revert the UI change on error
      setApplications(originalApplications);
      alert('Failed to update status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Go to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>

          {applications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">
                No applications have been received for this job posting yet.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ '& .MuiTableCell-root': { color: 'text.secondary', fontWeight: '600' } }}>
                  <TableRow>
                    <TableCell>APPLICANT</TableCell>
                    <TableCell>APPLIED ON</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell align="right">RESUME</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="500">{app.full_name}</Typography>
                        <Typography variant="body2" color="text.secondary">{app.email}</Typography>
                      </TableCell>
                      <TableCell>{formatDate(app.applied_at)}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          >
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="reviewed">Reviewed</MenuItem>
                            <MenuItem value="interviewing">Interviewing</MenuItem>
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