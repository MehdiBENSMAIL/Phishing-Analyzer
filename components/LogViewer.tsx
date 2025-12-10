import React, { useEffect, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";

interface LogViewerProps {
  logs: string[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 4,
        p: 2,
        bgcolor: "#1e1e1e",
        color: "#00ff00",
        fontFamily: "monospace",
        maxHeight: "300px",
        overflowY: "auto",
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: "#fff", mb: 1, borderBottom: "1px solid #333", pb: 0.5 }}
      >
        System Logs & Debug Output
      </Typography>
      {logs.map((log, index) => (
        <Box
          key={index}
          sx={{ display: "flex", gap: 1, fontSize: "0.85rem", lineHeight: 1.5 }}
        >
          <span style={{ color: "#555", userSelect: "none" }}>{index + 1}</span>
          <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {log}
          </span>
        </Box>
      ))}
      <div ref={endRef} />
    </Paper>
  );
};

export default LogViewer;
