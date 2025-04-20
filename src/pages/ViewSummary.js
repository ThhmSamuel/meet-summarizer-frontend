import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  FileCopy as FileCopyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSummary } from '../context/SummaryContext';
import html2pdf from 'html2pdf.js';
import MarkdownRenderer from '../components/MarkdownRenderer';

const ViewSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSummaryById, currentSummary, loading, error } = useSummary();

  useEffect(() => {
    if (id) {
      fetchSummaryById(id);
    }
  }, [id, fetchSummaryById]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/summary/${id}/edit`);
  };

  const handleCopyToClipboard = () => {
    if (!currentSummary) return;
    
    navigator.clipboard.writeText(currentSummary.editedSummary || currentSummary.summary)
      .then(() => {
        alert('Summary copied to clipboard');
      })
      .catch(() => {
        alert('Failed to copy to clipboard');
      });
  };

  const handleExportToPdf = () => {
    if (!currentSummary) return;
    
    const contentElement = document.getElementById('summary-content-for-pdf');
    
    const opt = {
      margin: [15, 15],
      filename: `${currentSummary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_minutes.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(contentElement).set(opt).save();
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

  const summaryContent = currentSummary.editedSummary || currentSummary.summary;
  const formattedDate = format(new Date(currentSummary.createdAt), 'MMMM d, yyyy');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back to Dashboard
        </Button>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileCopyIcon />}
            onClick={handleCopyToClipboard}
            sx={{ mr: 1 }}
          >
            Copy Text
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<PdfIcon />}
            onClick={handleExportToPdf}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Box>
      </Box>
      
      <Paper elevation={3} sx={{ padding: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {currentSummary.title}
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Generated on {formattedDate}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box id="summary-content">
          <MarkdownRenderer content={summaryContent} paper={false} />
        </Box>
      </Paper>

      {/* This is hidden and only used for PDF export */}
      <div style={{ display: 'none' }}>
        <div id="summary-content-for-pdf">
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>{currentSummary.title}</h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Generated on {formattedDate}
          </p>
          <div id="markdown-content-for-pdf">
            <MarkdownRenderer content={summaryContent} paper={false} />
          </div>
        </div>
      </div>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            About This Summary
          </Typography>
          <Typography variant="body2" paragraph>
            This meeting summary was automatically generated using AI from an audio recording.
            The content has been structured into a format suitable for meeting minutes.
          </Typography>
          <Typography variant="body2">
            Last modified: {format(new Date(currentSummary.updatedAt), 'MMMM d, yyyy h:mm a')}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewSummary;
