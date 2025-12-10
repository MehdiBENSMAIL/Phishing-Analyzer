import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

interface PhishingScoreGaugeProps {
  score: number;
}

const PhishingScoreGauge: React.FC<PhishingScoreGaugeProps> = ({ score }) => {
  const percentage = Math.round(score * 100);
  
  let color = '#10B981'; // success
  if (score > 0.75) color = '#EF4444'; // error
  else if (score > 0.35) color = '#F59E0B'; // warning

  const data = [
    { name: 'Score', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1, mb: 1 }}>
        Threat Probability
      </Typography>
      
      <Box sx={{ position: 'relative', width: 192, height: 192 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              <Cell key="score" fill={color} />
              <Cell key="remaining" fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color }}>
            {percentage}%
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="medium">
            XGBoost Score
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: -2, textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ color }}
        >
          {score > 0.75 ? 'HIGH RISK' : score > 0.35 ? 'CAUTION' : 'SAFE'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PhishingScoreGauge;
