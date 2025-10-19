import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, CircularProgress } from "@mui/material";

// Component Imports
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "../components/StatsCard";
import CalendarWidget from "../components/CalendarWidget";
import JobsTable from "../components/JobsTable";

// Icon Imports
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 16,
    shortlisted: 0,
    onboarded: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndLoadData();
  }, []);

  const checkUserAndLoadData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);

    // Fetch Jobs
    const { data: jobsData, error: jobsError } = await supabase
      .from("jobs")
      .select("*, applications(count)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (jobsError) {
      console.error("Error loading jobs:", jobsError);
    } else {
      setJobs(jobsData || []);
    }

    // Fetch Interviews
    const { data: interviewsData, error: interviewsError } = await supabase
      .from("interview_schedules")
      .select(`*, jobs (title)`)
      .eq("user_id", user.id)
      .eq("status", "scheduled")
      .gte("interview_date", new Date().toISOString());

    if (interviewsError) {
      console.error("Error fetching interviews:", interviewsError);
    } else {
      setInterviews(interviewsData || []);
    }

    // Calculate Stats
    if (jobsData && jobsData.length > 0) {
      const { data: applicationsData, error: applicationsError } =
        await supabase
          .from("applications")
          .select("status, job_id")
          .in(
            "job_id",
            jobsData.map((j) => j.id)
          );

      if (!applicationsError && applicationsData) {
        const statsData = {
          totalApplications: applicationsData.length,
          shortlisted: applicationsData.filter(
            (app) => app.status === "shortlisted" || app.status === "interviewing"
          ).length,
          onboarded: applicationsData.filter((app) => app.status === "hired")
            .length,
          rejected: applicationsData.filter((app) => app.status === "rejected")
            .length,
        };
        setStats(statsData);
      }
    } else {
      setStats({
        totalApplications: 0,
        shortlisted: 0,
        onboarded: 0,
        rejected: 0,
      });
    }

    setLoading(false);
  };

  const calendarEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const typeToColor = {
      phone: "#2196f3",
      video: "#9c27b0",
      "in-person": "#ff9800",
      default: "#607d8b",
    };

    return interviews
      .map((interview) => {
        const interviewDate = new Date(interview.interview_date);
        const interviewDay = new Date(interviewDate);
        interviewDay.setHours(0, 0, 0, 0);

        let type = "upcoming";
        let displayDate = interviewDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (interviewDay.getTime() === today.getTime()) {
          type = "today";
          displayDate = interviewDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        } else if (interviewDay.getTime() === tomorrow.getTime()) {
          displayDate = "Tomorrow";
        }

        return {
          type: type,
          title: interview.applicant_name,
          status: interview.jobs?.title || "Unknown Job",
          date: displayDate,
          color: typeToColor[interview.interview_type] || typeToColor.default,
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [interviews]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getUsername = (email) => {
    return email.split("@")[0];
  };

  const copyJobLink = (job) => {
    const link = `${window.location.origin}/apply/${getUsername(user.email)}/${
      job.slug
    }`;
    navigator.clipboard.writeText(link);
    alert("Public job link copied to clipboard!");
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);
      if (error) {
        alert("Error deleting job: " + error.message);
      } else {
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
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
          backgroundColor: "#fafafa",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <DashboardHeader
        user={user}
        onLogout={handleLogout}
        onNewJob={() => navigate("/create-job")}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Main Grid Layout - Two Columns with Fixed Heights */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            mb: 3,
            alignItems: "stretch",
          }}
        >
          {/* Left Column - Stats Cards */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recruitment overview of this month
              </Typography>
            </Box>

            {/* 2x2 Grid for Stats Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                flex: 1,
                rowGap: 5,
                mb: 2.5,
              }}
            >
              {[
                {
                  icon: ArticleOutlinedIcon,
                  value: stats.totalApplications,
                  label: "Applications",
                  theme: {
                    gradient: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                    iconBg: "#1e88e5",
                    iconColor: "#fff",
                  },
                },
                {
                  icon: PersonSearchIcon,
                  value: stats.shortlisted,
                  label: "Shortlisted",
                  theme: {
                    gradient: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
                    iconBg: "#fb8c00",
                    iconColor: "#fff",
                  },
                },
                {
                  icon: FactCheckOutlinedIcon,
                  value: stats.onboarded,
                  label: "Onboarded",
                  theme: {
                    gradient: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
                    iconBg: "#43a047",
                    iconColor: "#fff",
                  },
                },
                {
                  icon: PlaylistRemoveIcon,
                  value: stats.rejected,
                  label: "Rejected",
                  theme: {
                    gradient: "linear-gradient(135deg, #ffebee, #ffcdd2)",
                    iconBg: "#e53935",
                    iconColor: "#fff",
                  },
                },
              ].map((card, i) => (
                <StatsCard
                  key={i}
                  icon={card.icon}
                  value={card.value}
                  label={card.label}
                  themeColors={card.theme}
                />
              ))}
            </Box>
          </Box>

          {/* Right Column - Calendar Widget */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CalendarWidget events={calendarEvents} />
          </Box>
        </Box>

        {/* Jobs Table - Full Width Below */}
        <JobsTable
          jobs={jobs}
          onViewApplications={(jobId) =>
            navigate(`/jobs/${jobId}/applications`)
          }
          onEditJob={(jobId) => navigate(`/jobs/${jobId}/edit`)}
          onDeleteJob={handleDeleteJob}
          onCopyLink={copyJobLink}
        />
      </Container>
    </Box>
  );
}

export default Dashboard;
