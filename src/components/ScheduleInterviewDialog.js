import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { supabase } from "../lib/supabase";

// 1. Accept 'jobId' as a prop
function ScheduleInterviewDialog({
  open,
  onClose,
  application,
  jobTitle,
  onScheduled,
  jobId,
}) {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewType: "video",
    meetingLink: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSchedule = async () => {
    if (!formData.interviewDate || !formData.interviewTime) {
      setError("Please select date and time for the interview");
      return;
    }

    // Add a check for the jobId prop
    if (!jobId) {
      setError("Job ID is missing. Cannot schedule interview.");
      console.error("Job ID prop is missing in ScheduleInterviewDialog");
      return;
    }

    setLoading(true);
    setError("");

    // Combine date and time
    const interviewDateTime = new Date(
      `${formData.interviewDate}T${formData.interviewTime}`
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase
      .from("interview_schedules")
      .insert({
        application_id: application.id,
        job_id: jobId, // 2. Use the 'jobId' prop here instead of application.job_id
        user_id: user.id,
        applicant_name: application.full_name,
        applicant_email: application.email,
        interview_date: interviewDateTime.toISOString(),
        interview_type: formData.interviewType,
        meeting_link: formData.meetingLink,
        notes: formData.notes,
        status: "scheduled",
      });

    if (insertError) {
      console.error("Error scheduling interview:", insertError);
      setError("Failed to schedule interview. Please try again.");
      setLoading(false);
      return;
    }

    // Update application status to 'interviewing'
    await supabase
      .from("applications")
      .update({ status: "interviewing" })
      .eq("id", application.id);

    setLoading(false);
    onScheduled?.();
    onClose();

    // Reset form
    setFormData({
      interviewDate: "",
      interviewTime: "",
      interviewType: "video",
      meetingLink: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Schedule Interview
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {application?.full_name} • {jobTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Interview Date"
            type="date"
            value={formData.interviewDate}
            onChange={handleChange("interviewDate")}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="Interview Time"
            type="time"
            value={formData.interviewTime}
            onChange={handleChange("interviewTime")}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Interview Type</InputLabel>
            <Select
              value={formData.interviewType}
              onChange={handleChange("interviewType")}
              label="Interview Type"
            >
              <MenuItem value="phone">Phone Call</MenuItem>
              <MenuItem value="video">Video Call</MenuItem>
              <MenuItem value="in-person">In-Person</MenuItem>
            </Select>
          </FormControl>

          {formData.interviewType === "video" && (
            <TextField
              label="Meeting Link (Zoom, Google Meet, etc.)"
              value={formData.meetingLink}
              onChange={handleChange("meetingLink")}
              placeholder="https://zoom.us/j/..."
              fullWidth
            />
          )}

          <TextField
            label="Notes (Optional)"
            value={formData.notes}
            onChange={handleChange("notes")}
            multiline
            rows={3}
            placeholder="Add any additional notes about the interview..."
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSchedule} variant="contained" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Interview"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ScheduleInterviewDialog;
