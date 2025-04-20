import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  FormControlLabel, 
  Switch,
  TextField,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';

/**
 * Component for exporting summary to PDF with options
 * @param {Object} props - Component props
 * @param {String} props.title - Document title
 * @param {String} props.content - HTML content to export
 * @param {String} props.dateCreated - Date created string
 */
const PDFExport = ({ title, content, dateCreated }) => {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Initialize file name when dialog opens
  const handleOpen = () => {
    setFileName(title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_minutes');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExport = () => {
    setExporting(true);
    
    // Prepare content for PDF
    const contentDiv = document.createElement('div');
    
    // Add header if selected
    if (includeHeader) {
      contentDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">${title}</h1>
        </div>
      `;
    }
    
    // Add metadata if selected
    if (includeMetadata) {
      contentDiv.innerHTML += `
        <div style="font-size: 14px; color: #666; margin-bottom: 24px;">
          Generated on ${dateCreated}
        </div>
      `;
    }
    
    // Add main content
    contentDiv.innerHTML += `
      <div style="font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6;">
        ${content}
      </div>
    `;
    
    // Configure PDF options
    const opt = {
      margin: [15, 15],
      filename: `${fileName || 'meeting_minutes'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF
    html2pdf().from(contentDiv).set(opt).save()
      .then(() => {
        setExporting(false);
        handleClose();
      })
      .catch(error => {
        console.error('Error exporting PDF:', error);
        setExporting(false);
      });
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<PdfIcon />}
        onClick={handleOpen}
      >
        Export PDF
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Export as PDF</DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="File Name"
              variant="outlined"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={exporting}
              sx={{ mb: 3 }}
              helperText="PDF file name without extension"
            />
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={includeHeader}
                    onChange={(e) => setIncludeHeader(e.target.checked)}
                    disabled={exporting}
                  />
                }
                label="Include title header"
              />
            </FormControl>
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    disabled={exporting}
                  />
                }
                label="Include date metadata"
              />
            </FormControl>
          </Box>
          
          {exporting && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
                Generating PDF...
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={exporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            color="primary"
            disabled={exporting || !fileName.trim()}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PDFExport;