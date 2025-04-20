import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import AudioUploader from '../components/AudioUploader';
import SummaryList from '../components/SummaryList';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Meet Summarizer AI
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Upload your meeting recordings and let AI generate professional meeting minutes.
          Edit, save, and export your summaries with ease.
        </Typography>
      </Box>
      
      <AudioUploader />
      
      <Box sx={{ my: 4 }}>
        <Divider />
      </Box>
      
      <SummaryList />
    </Container>
  );
};

export default Dashboard;