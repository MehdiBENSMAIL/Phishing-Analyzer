import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
  Fade,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SecurityIcon from "@mui/icons-material/Security";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EmailForm from "./components/EmailForm";
import PhishingScoreGauge from "./components/PhishingScoreGauge";
import AnalysisReport from "./components/AnalysisReport";
import LogViewer from "./components/LogViewer";
import { analyzeEmail } from "./services/aiService";
import { EmailData, AnalysisResult, AnalysisStatus } from "./types";

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleAnalyze = async (data: EmailData) => {
    setStatus(AnalysisStatus.ANALYZING);
    setLogs([]); // Clear previous logs
    try {
      const analysisResult = await analyzeEmail(data, (msg) => {
        setLogs((prev) => [...prev, msg]);
      });
      setResult(analysisResult);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
      setLogs((prev) => [...prev, `[ERROR] ${error}`]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" component="h1" fontWeight="bold">
              PhishGuard
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 5, flexGrow: 1 }}>
        <Grid container spacing={4}>
          {/* Left Column: Input */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={1}
              sx={{ p: 3, borderTop: 4, borderColor: "primary.main" }}
            >
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Email Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill the different fields below
              </Typography>
              <EmailForm
                onAnalyze={handleAnalyze}
                isAnalyzing={status === AnalysisStatus.ANALYZING}
              />
            </Paper>
          </Grid>

          {/* Right Column: Results */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {status === AnalysisStatus.IDLE && (
              <Paper
                variant="outlined"
                sx={{
                  height: "100%",
                  minHeight: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "dashed",
                  bgcolor: "background.default",
                }}
              >
                <MailOutlineIcon
                  sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Ready to Analyze the caca
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Input email data to start the analyzis
                </Typography>
              </Paper>
            )}

            {status === AnalysisStatus.ANALYZING && (
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  minHeight: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "transparent",
                }}
              >
                <CircularProgress size={48} sx={{ mb: 2 }} />
                <Typography
                  color="text.secondary"
                  sx={{ animation: "pulse 2s infinite" }}
                >
                  Running XGBoost Model...
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ mt: 1 }}
                >
                  Consulting Local AI...
                </Typography>
              </Paper>
            )}

            {status === AnalysisStatus.COMPLETED && result && (
              <Fade in={true}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Grid container spacing={3}>
                    {/* Score Card */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <PhishingScoreGauge score={result.xgboostScore} />
                    </Grid>

                    {/* Key Metrics */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{
                          p: 3,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: 1,
                            borderColor: "divider",
                            pb: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Domain Trust
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={
                              result.xgboostScore > 0.5
                                ? "error.main"
                                : "success.main"
                            }
                          >
                            {result.xgboostScore > 0.5 ? "Low" : "Verified"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: 1,
                            borderColor: "divider",
                            pb: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Urgency Detection
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={
                              result.xgboostScore > 0.5
                                ? "warning.main"
                                : "text.secondary"
                            }
                          >
                            {result.xgboostScore > 0.5 ? "High" : "Normal"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Link Analysis
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="text.primary"
                          >
                            Scanned
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* AI Report */}
                  <AnalysisReport result={result} />
                </Box>
              </Fade>
            )}

            {status === AnalysisStatus.ERROR && (
              <Alert severity="error" variant="filled">
                Something went wrong. Please ensure Ollama is running and try
                again.
              </Alert>
            )}
          </Grid>
        </Grid>

        <LogViewer logs={logs} />
      </Container>
    </Box>
  );
};

export default App;
