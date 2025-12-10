import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  result: AnalysisResult;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3" fontWeight="bold">
          AI Insights
        </Typography>
      </Box>
      
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {result.aiAnalysis}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="caption" color="text.disabled">
        Analysis generated at {result.timestamp.toLocaleTimeString()}
      </Typography>
    </Paper>
  );
};

export default AnalysisReport;
