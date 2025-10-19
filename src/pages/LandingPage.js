import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Work as WorkIcon,
  AutoAwesome as SparklesIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Description as FileTextIcon,
  Schedule as ClockIcon,
  SentimentVeryDissatisfied as FrownIcon,
  SentimentVerySatisfied as SmileIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";

function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Post Jobs Instantly",
      description:
        "Create and publish job listings in minutes with our intuitive interface.",
    },
    {
      icon: <SparklesIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "AI-Powered Screening",
      description:
        "Let AI analyze resumes and rank candidates automatically, saving you hours.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Fast Application Process",
      description:
        "Candidates apply with just a few clicks using our streamlined form.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Applicant Management",
      description:
        "Track, review, and manage all applications from one central dashboard.",
    },
    {
      icon: <CheckIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Automated Notifications",
      description:
        "Keep candidates informed with automated email updates at every stage.",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Analytics & Insights",
      description:
        "Make data-driven hiring decisions with comprehensive application metrics.",
    },
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      role: "VP of Talent, TechCorp",
      avatar: "JM",
      content:
        "JobPost cut our time-to-hire by 65%. We went from 6 weeks to 2 weeks average. The AI screening is incredibly accurate.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Head of HR, StartupXYZ",
      avatar: "DK",
      content:
        "Best investment we made this year. Our small team now handles workload that used to require twice the people.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Recruiting Director, ScaleUp Inc",
      avatar: "SJ",
      content:
        "The automated scheduling alone saves us 20+ hours weekly. Candidates love the smooth experience.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$199",
      period: "/month",
      description: "Perfect for small teams",
      features: [
        "Up to 50 active jobs",
        "500 AI candidate screenings/mo",
        "Basic analytics",
        "Email support",
        "Standard integrations",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$499",
      period: "/month",
      description: "For growing companies",
      badge: "Most Popular",
      features: [
        "Unlimited active jobs",
        "5,000 AI screenings/mo",
        "Advanced analytics & insights",
        "Priority support + Slack",
        "All integrations",
        "Custom workflows",
        "Interview scheduling AI",
        "Dedicated success manager",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Unlimited AI screenings",
        "Custom AI model training",
        "SSO & advanced security",
        "API access",
        "Custom integrations",
        "On-premise deployment option",
        "24/7 phone support",
      ],
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "How accurate is the AI screening?",
      answer:
        "Our AI has been trained on millions of applications and achieves high accuracy. You're always in control - the AI suggests, you decide. Think of it as a smart assistant, not a replacement.",
    },
    {
      question: "Can I really set this up quickly?",
      answer:
        "Yes! Most teams are screening candidates within their first day. Connect your account, add your job descriptions, and our AI does the rest. No complex setup needed.",
    },
    {
      question: "What if candidates prefer human interaction?",
      answer:
        "Most candidates appreciate faster responses and clearer communication. The AI handles scheduling and routine tasks, but all meaningful interactions stay human.",
    },
    {
      question: "Do I need to change our current process?",
      answer:
        "No. JobPost adapts to your workflow. We integrate with popular tools and platforms. We make your process better, not replace it.",
    },
    {
      question: "What about data security?",
      answer:
        "Your data stays yours. We're compliant with major security standards and never train our AI on your confidential information. You can export or delete everything anytime.",
    },
  ];

  return (
    <Box>
      {/* Navigation */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#2563eb",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SparklesIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ color: "#111", fontWeight: 600 }}>
                JobPost
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 4,
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#666",
                  cursor: "pointer",
                  "&:hover": { color: "#111" },
                }}
              >
                Features
              </Typography>
              <Typography
                sx={{
                  color: "#666",
                  cursor: "pointer",
                  "&:hover": { color: "#111" },
                }}
              >
                Pricing
              </Typography>
              <Typography
                sx={{
                  color: "#666",
                  cursor: "pointer",
                  "&:hover": { color: "#111" },
                }}
              >
                Customers
              </Typography>
              <Button
                variant="text"
                sx={{ color: "#666" }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#2563eb", textTransform: "none" }}
                onClick={() => navigate("/signup")}
              >
                Start Free Trial
              </Button>
            </Box>

            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItem button>
              <ListItemText primary="Features" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Pricing" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Customers" />
            </ListItem>
            <ListItem button onClick={() => navigate("/login")}>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem button onClick={() => navigate("/signup")}>
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#2563eb" }}
              >
                Start Free Trial
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #f3e8ff 100%)",
          py: { xs: 8, md: 15 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="AI-Powered Recruiting"
                icon={<SparklesIcon />}
                sx={{ mb: 3, backgroundColor: "#ddd6fe", color: "#6b21a8" }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Stop drowning in{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  spreadsheets
                </Box>
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Start hiring faster
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 500 }}
              >
                JobPost uses AI to automatically screen candidates, schedule
                interviews, and identify top talent—so you focus on building
                exceptional teams.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#2563eb",
                    textTransform: "none",
                    px: 4,
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Start Free Trial
                </Button>
                <Box>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    73%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Faster Hiring
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SparklesIcon sx={{ color: "#7c3aed" }} />
                    <Typography variant="body2" color="text.secondary">
                      AI Candidate Scoring
                    </Typography>
                  </Stack>
                  <Chip
                    label="Live Demo"
                    size="small"
                    icon={<ClockIcon />}
                    variant="outlined"
                  />
                </Stack>

                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={2}>
                    <Avatar
                      sx={{ width: 56, height: 56, backgroundColor: "#2563eb" }}
                    >
                      SC
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <Box>
                          <Typography variant="h6">Sarah Chen</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Senior Product Manager
                          </Typography>
                        </Box>
                        <Chip
                          label="Score: 94"
                          size="small"
                          sx={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                        />
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Chip
                          label="Product Strategy"
                          size="small"
                          variant="outlined"
                        />
                        <Chip label="Agile" size="small" variant="outlined" />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        8 years experience
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "#f3e8ff",
                    border: "1px solid #e9d5ff",
                    mb: 3,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="start">
                    <SparklesIcon
                      sx={{ color: "#7c3aed", fontSize: 20, mt: 0.5 }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6b21a8", fontWeight: 600 }}
                      >
                        AI Insight
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#7c3aed", mt: 0.5 }}
                      >
                        Strong product vision with proven track record at
                        scale-ups
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    color="error"
                    sx={{ textTransform: "none" }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: "#16a34a", textTransform: "none" }}
                  >
                    Advance
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Problem/Solution Section */}
      <Box sx={{ py: 12, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Stop wasting 40 hours per week on manual screening
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Traditional hiring is broken. You're drowning in applications
              while top talent slips away to faster competitors.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  backgroundColor: "#fef2f2",
                  border: "2px solid #fecaca",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    backgroundColor: "#fca5a5",
                    borderRadius: "50%",
                    opacity: 0.3,
                  }}
                />
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Avatar sx={{ backgroundColor: "#fee2e2" }}>
                    <FrownIcon sx={{ color: "#dc2626" }} />
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{ color: "#7f1d1d", fontWeight: 600 }}
                  >
                    The Old Way
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  <Stack direction="row" spacing={2}>
                    <EmailIcon sx={{ color: "#dc2626", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ color: "#7f1d1d", fontWeight: 600 }}>
                        Endless Email Chains
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#991b1b", mt: 0.5 }}
                      >
                        Lost messages, missed candidates, coordination
                        nightmares
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <FileTextIcon sx={{ color: "#dc2626", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ color: "#7f1d1d", fontWeight: 600 }}>
                        Manual Resume Screening
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#991b1b", mt: 0.5 }}
                      >
                        Hours wasted reading 200+ applications for every role
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <ClockIcon sx={{ color: "#dc2626", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ color: "#7f1d1d", fontWeight: 600 }}>
                        45+ Days to Hire
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#991b1b", mt: 0.5 }}
                      >
                        Best candidates accept other offers while you're still
                        scheduling
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  backgroundColor: "#f0fdf4",
                  border: "2px solid #bbf7d0",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    backgroundColor: "#86efac",
                    borderRadius: "50%",
                    opacity: 0.3,
                  }}
                />
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Avatar sx={{ backgroundColor: "#dcfce7" }}>
                    <SmileIcon sx={{ color: "#16a34a" }} />
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{ color: "#14532d", fontWeight: 600 }}
                  >
                    With JobPost
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  <Stack direction="row" spacing={2}>
                    <SparklesIcon sx={{ color: "#16a34a", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ color: "#14532d", fontWeight: 600 }}>
                        AI Auto-Screening
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#166534", mt: 0.5 }}
                      >
                        AI reads every resume and scores candidates in seconds
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <SpeedIcon sx={{ color: "#16a34a", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ color: "#14532d", fontWeight: 600 }}>
                        Automated Scheduling
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#166534", mt: 0.5 }}
                      >
                        Interviews book themselves based on team availability
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <CheckIcon sx={{ color: "#16a34a", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ color: "#14532d", fontWeight: 600 }}>
                        12 Days to Hire
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#166534", mt: 0.5 }}
                      >
                        Move 73% faster and secure top talent before competitors
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ py: 12, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Everything You Need to Hire Better
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powerful features designed to streamline your recruitment process
            </Typography>
          </Box>

          {/* The container Box */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              // --- ADD THIS LINE ---
              justifyContent: "center", // This centers the group of cards
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  p: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-8px)", boxShadow: 6 },
                  display: "flex",
                  flexDirection: "column",
                  width: {
                    xs: "100%",
                    md: "calc((100% - 64px) / 3)",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: 12, backgroundColor: "white" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Questions? We've got answers
            </Typography>
            <Typography variant="h6" color="text.secondary">
              (And if we don't, our support team is refreshingly human)
            </Typography>
          </Box>

          <Box>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{ mb: 2, "&:before": { display: "none" }, boxShadow: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Still have questions?
            </Typography>
            <Typography
              sx={{
                color: "#2563eb",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Chat with our team →
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#111", color: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#2563eb",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SparklesIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  JobPost
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                AI-powered recruiting software that helps you hire faster and
                smarter.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Twitter
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  LinkedIn
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  GitHub
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Product
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Features
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Integrations
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Pricing
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Changelog
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Compare
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  vs. Greenhouse
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  vs. Lever
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  vs. Workday
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  vs. Spreadsheets
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Resources
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Blog
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Help Center
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  API Docs
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Community
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Company
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  About
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Careers
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Contact
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    cursor: "pointer",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Privacy Policy
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 6,
              pt: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2025 JobPost. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.6,
                  cursor: "pointer",
                  "&:hover": { opacity: 1 },
                }}
              >
                Terms
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.6,
                  cursor: "pointer",
                  "&:hover": { opacity: 1 },
                }}
              >
                Privacy
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.6,
                  cursor: "pointer",
                  "&:hover": { opacity: 1 },
                }}
              >
                Cookies
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
