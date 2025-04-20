import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Tabs, 
  Tab, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Visibility as VisibilityIcon,
  Description as DescriptionIcon, 
  AudioFile as AudioFileIcon 
} from '@mui/icons-material';
import MarkdownEditor from '../components/MarkdownEditor';
import { useSummary } from '../context/SummaryContext';

const EditSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSummaryById, currentSummary, loading, error } = useSummary();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (id) {
      fetchSummaryById(id);
    }
  }, [id, fetchSummaryById]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleViewSummary = () => {
    navigate(`/summary/${id}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !currentSummary) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography color="error">
            Error loading summary. Please try again.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!currentSummary) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography>
            Summary not found.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back to Dashboard
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={handleViewSummary}
        >
          View Summary
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label="summary tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.95rem',
            }
          }}
        >
          <Tab icon={<DescriptionIcon />} label="Meeting Minutes" />
          <Tab icon={<AudioFileIcon />} label="Original Transcription" />
        </Tabs>
      </Box>
      
      {activeTab === 0 && (
        <MarkdownEditor summaryId={id} />
      )}
      
      {activeTab === 1 && (
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Original Transcription
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This is the raw transcription from your audio. It's shown here for reference only and cannot be edited.
          </Typography>
          <Box 
            sx={{ 
              bgcolor: '#f5f5f5',
              p: 3, 
              borderRadius: 1,
              fontFamily: '"Roboto Mono", monospace',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              maxHeight: '60vh',
              overflow: 'auto'
            }}
          >
            {currentSummary.transcription}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default EditSummary;