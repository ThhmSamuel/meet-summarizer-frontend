import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  FileCopy as FileCopyIcon,
  PictureAsPdf as PdfIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { useSummary } from '../context/SummaryContext';
import html2pdf from 'html2pdf.js';
import MarkdownRenderer from './MarkdownRenderer';

const MarkdownEditor = ({ summaryId }) => {
  const { currentSummary, updateSummaryData, loading } = useSummary();
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (currentSummary) {
      setTitle(currentSummary.title);
      setMarkdownContent(currentSummary.editedSummary || currentSummary.summary);
    }
  }, [currentSummary]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setMarkdownContent(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a title',
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      await updateSummaryData(summaryId, {
        title,
        editedSummary: markdownContent
      });
      
      setSnackbar({
        open: true,
        message: 'Summary saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving summary:', error);
      setSnackbar({
        open: true,
        message: 'Error saving summary',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Markdown copied to clipboard',
          severity: 'success'
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Failed to copy to clipboard',
          severity: 'error'
        });
      });
  };

  const handleExportToPdf = () => {
    if (!currentSummary) return;
    
    setExporting(true);
    
    // Get the rendered markdown content
    const contentElement = document.getElementById('markdown-preview-content');
    
    if (!contentElement) {
      setSnackbar({
        open: true,
        message: 'Error: Preview content not found',
        severity: 'error'
      });
      setExporting(false);
      return;
    }
    
    const opt = {
      margin: [15, 15],
      filename: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_minutes.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(contentElement).set(opt).save()
      .then(() => {
        setSnackbar({
          open: true,
          message: 'PDF exported successfully',
          severity: 'success'
        });
        setExporting(false);
      })
      .catch(error => {
        console.error('Error exporting PDF:', error);
        setSnackbar({
          open: true,
          message: 'Error exporting PDF',
          severity: 'error'
        });
        setExporting(false);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && !currentSummary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Meeting Title"
          variant="outlined"
          value={title}
          onChange={handleTitleChange}
          InputProps={{
            sx: { fontWeight: 'medium', fontSize: '1.1rem' }
          }}
        />
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="editor tabs">
          <Tab icon={<CodeIcon />} label="Edit" id="tab-edit" />
          <Tab icon={<VisibilityIcon />} label="Preview" id="tab-preview" />
        </Tabs>
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-edit">
        {tabValue === 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Edit Meeting Minutes (Markdown)
            </Typography>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              value={markdownContent}
              onChange={handleContentChange}
              rows={20}
              sx={{
                fontFamily: 'monospace',
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                }
              }}
            />
          </Box>
        )}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-preview">
        {tabValue === 1 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Preview
            </Typography>
            <Box id="markdown-preview-content">
              <MarkdownRenderer content={markdownContent} />
            </Box>
          </Box>
        )}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<FileCopyIcon />}
          onClick={handleCopyToClipboard}
          disabled={saving || exporting}
        >
          Copy Markdown
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<PdfIcon />}
          onClick={handleExportToPdf}
          disabled={saving || exporting}
        >
          {exporting ? 'Exporting...' : 'Export PDF'}
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving || exporting}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default MarkdownEditor;