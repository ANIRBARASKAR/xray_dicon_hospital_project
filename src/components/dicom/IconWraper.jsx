import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

export default function IconWraper({ label, children }) {
  return (
    <Box
      sx={{
        fontSize: "x-small",
        maxWidth: "4rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#535151",
      }}
    >
      {children}
      <Typography
        noWrap
        sx={{
          textTransform: "lowercase",
          width: "4rem",
          textAlign: "center",
          color: "#535151",
        }}
        variant="caption"
        gutterBottom
      >
        {label}
      </Typography>
    </Box>
  );
}
