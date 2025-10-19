import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Material-UI Imports
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function PublicJobPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    linkedinUrl: "",
    portfolioUrl: "",
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

      if (error || !data) {
        setError("Job not found or no longer active.");
      } else {
        setJob(data);
      }
      setLoading(false);
    };
    loadJob();
  }, [slug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or DOC file only.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        alert("File size must be less than 5MB.");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError("");

    if (!resumeFile) {
      setError("Please upload your resume.");
      setApplying(false);
      return;
    }

    try {
      console.log("=== Starting Application Submission ===");

      // 1. Insert application data first to get a unique ID
      const { data: appData, error: insertError } = await supabase
        .from("applications")
        .insert([
          {
            job_id: job.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            resume_url: "pending",
            cover_letter: formData.coverLetter,
            linkedin_url: formData.linkedinUrl,
            portfolio_url: formData.portfolioUrl,
            status: "new",
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      const applicationId = appData.id;
      console.log("Application created:", applicationId);

      // 2. Upload the resume
      const fileExt = resumeFile.name.split(".").pop();
      const filePath = `resumes/${applicationId}.${fileExt}`;

      console.log("Uploading resume to:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("applications")
        .upload(filePath, resumeFile, {
          upsert: true,
          metadata: { applicationId: applicationId },
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Resume uploaded successfully");

      // 3. Get the public URL
      const { data: urlData } = supabase.storage
        .from("applications")
        .getPublicUrl(filePath);

      console.log("Resume URL:", urlData.publicUrl);

      // 4. Update the application with the resume URL
      const { error: updateError } = await supabase
        .from("applications")
        .update({ resume_url: urlData.publicUrl })
        .eq("id", applicationId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Application updated with resume URL");

      // 5. Mark as submitted first (so user sees success)
      setSubmitted(true);

      // 6. Trigger AI screening in background (after success screen)
      setTimeout(async () => {
        try {
          console.log("Triggering AI screening for:", applicationId);

          const { data: aiData, error: aiError } =
            await supabase.functions.invoke("ai-screen-resume", {
              body: { applicationId: applicationId },
            });

          if (aiError) {
            console.error("AI screening failed:", aiError);
          } else {
            console.log("AI screening triggered:", aiData);
          }
        } catch (err) {
          console.error("AI screening exception:", err);
        }
      }, 2000); // Wait 2 seconds after submission
    } catch (error) {
      console.error("=== Submission Error ===");
      console.error(error);
      setError(`Submission failed: ${error.message}. Please try again.`);
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, textAlign: "center", borderRadius: 3 }}
        >
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 60, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Application Submitted!
          </Typography>
          <Typography color="text.secondary">
            Thank you for applying to <strong>{job.title}</strong> at{" "}
            {job.company_name}. We'll review your application and get back to
            you soon.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error && !job) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, textAlign: "center", borderRadius: 3 }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Job Not Found
          </Typography>
          <Typography color="text.secondary">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", py: 5 }}>
      <Container maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                {job.title}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mb: 2,
                  color: "text.secondary",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Chip
                  icon={<BusinessCenterIcon />}
                  label={job.company_name}
                  variant="outlined"
                />
                <Chip
                  icon={<LocationOnIcon />}
                  label={job.location}
                  variant="outlined"
                />
                {job.salary_range && (
                  <Chip
                    icon={<MonetizationOnIcon />}
                    label={job.salary_range}
                    variant="outlined"
                  />
                )}
              </Stack>
              <Box sx={{ my: 3 }}>
                <Typography variant="h6" gutterBottom>
                  About the Role
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {job.description}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {job.requirements}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Apply for this position
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {error && (
                    <Grid item xs={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="fullName"
                      label="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="phone"
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<UploadFileIcon />}
                    >
                      Upload Resume (PDF, DOC) *
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                      />
                    </Button>
                    {resumeFile && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        Selected: {resumeFile.name}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="coverLetter"
                      label="Cover Letter (optional)"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      multiline
                      rows={5}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="linkedinUrl"
                      label="LinkedIn URL (optional)"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="portfolioUrl"
                      label="Portfolio URL (optional)"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={applying}
                      fullWidth
                    >
                      {applying ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PublicJobPage;
