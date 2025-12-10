import React, { useState } from 'react';
import { TextField, Button, Stack, InputAdornment, CircularProgress } from '@mui/material';
import { EmailData } from '../types';

interface EmailFormProps {
  onAnalyze: (data: EmailData) => void;
  isAnalyzing: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({ onAnalyze, isAnalyzing }) => {
  const [formData, setFormData] = useState<EmailData>({
    sender: '',
    subject: '',
    content: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sender && formData.content) {
      onAnalyze(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Sender"
          name="sender"
          value={formData.sender}
          onChange={handleChange}
          placeholder="e.g., support@bank.com"
          fullWidth
          required
          variant="outlined"
          disabled={isAnalyzing}
        />

        <TextField
          label="Subject Line"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
          disabled={isAnalyzing}
        />

        <TextField
          label="Email Body Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={6}
          fullWidth
          required
          variant="outlined"
          disabled={isAnalyzing}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isAnalyzing}
          startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ py: 1.5 }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Email'}
        </Button>
      </Stack>
    </form>
  );
};

export default EmailForm;
