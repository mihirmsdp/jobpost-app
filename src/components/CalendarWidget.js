import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";

function CalendarWidget({ events = [] }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayEvents = events.filter((event) => event.type === "today");
  const upcomingEvents = events.filter((event) => event.type === "upcoming");

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Calendar
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, display: "block" }}
      >
        {formattedDate}
      </Typography>

      {/* This Box is now explicitly scrollable with a fixed max height */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pr: 1,
          maxHeight: 280, // <-- ADDED THIS LINE to enforce a maximum height
          // Custom scrollbar styling for a cleaner look
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#aaa",
            },
          },
        }}
      >
        {/* The rest of the component remains the same */}
        {todayEvents.length > 0 && (
          <>
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: 0.5,
                fontSize: "0.7rem",
              }}
            >
              TODAY
            </Typography>
            <Box sx={{ mt: 1, mb: 2 }}>
              {todayEvents.map((event, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 1.5,
                    pl: 2,
                    borderLeft: `3px solid ${event.color}`,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {event.title}
                    </Typography>
                    <Chip
                      label={event.status}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        mt: 0.5,
                        bgcolor: `${event.color}15`,
                        color: event.color,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {event.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {upcomingEvents.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: 0.5,
                fontSize: "0.7rem",
              }}
            >
              UPCOMING
            </Typography>
            <Box sx={{ mt: 1 }}>
              {upcomingEvents.map((event, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 1.5,
                    pl: 2,
                    borderLeft: `3px solid ${event.color}`,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {event.title}
                    </Typography>
                    <Chip
                      label={event.status}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        mt: 0.5,
                        bgcolor: `${event.color}15`,
                        color: event.color,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {event.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {events.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No upcoming events
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default CalendarWidget;
