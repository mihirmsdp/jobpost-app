import React from "react";
import { Box, Typography, Paper } from "@mui/material";

function StatsCard({ icon: Icon, value, label, themeColors }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.2,
        borderRadius: 2,
        background: themeColors.gradient,
        border: "1px solid #e0e0e0",
        height: "100%",
        minHeight: 75,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: themeColors.iconBg,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          mb: 0.8,
        }}
      >
        <Icon sx={{ fontSize: 15, color: themeColors.iconColor }} />
      </Box>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: "text.primary", mb: 0.2, fontSize: "1.2rem", lineHeight: 1 }}
      >
        {value}
      </Typography>
      <Typography 
        variant="caption" 
        color="text.secondary" 
        fontWeight={500}
        sx={{ fontSize: "0.68rem", lineHeight: 1.2 }}
      >
        {label}
      </Typography>
    </Paper>
  );
}

export default StatsCard;