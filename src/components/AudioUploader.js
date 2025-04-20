import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  AudioFile as AudioFileIcon 
} from '@mui/icons-material';
import { uploadAndProcessAudio } from '../api/api';

const AudioUploader = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  // Track progress with a timer to simulate processing steps
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prevProgress + 5;
      });
    }, 500);
    
    return interval;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is an audio file
      if (!selectedFile.type.startsWith('audio/')) {
        setError('Please upload an audio file');
        setFile(null);
        return;
      }
      
      // Check file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File is too large. Maximum size is 50MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      // Auto-generate title from filename
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
        setTitle(fileName);
      }
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an audio file');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Simulate progress
      const interval = simulateProgress();
      
      // Create form data
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('title', title);
      
      // Upload and process audio
      const response = await uploadAndProcessAudio(formData);
      
      // Clear interval and set progress to 100%
      clearInterval(interval);
      setProgress(100);
      
      // Navigate to edit page after short delay
      setTimeout(() => {
        navigate(`/summary/${response.data._id}/edit`);
      }, 500);
      
    } catch (err) {
      setError('Error processing audio. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
        Upload Audio for Transcription
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ textAlign: 'center', maxWidth: '80%', mb: 3 }}>
        Upload your meeting recording to automatically generate transcription and meeting minutes using AI.
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ width: '100%', mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Meeting Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          sx={{ mb: 3 }}
        />
        
        {!file ? (
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              padding: 6,
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: '#e9ecef',
              },
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('audio-upload').click()}
          >
            <input
              type="file"
              id="audio-upload"
              hidden
              accept="audio/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop or Click to Upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported formats: MP3, WAV, M4A, FLAC (Max: 50MB)
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              padding: 2,
              backgroundColor: '#f8f9fa',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AudioFileIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </Box>
            </Box>
            
            <IconButton 
              onClick={removeFile} 
              disabled={loading}
              aria-label="remove file"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
              <CircularProgress variant="determinate" value={progress} size={60} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {progress < 30 ? 'Uploading audio...' : 
               progress < 60 ? 'Transcribing audio...' : 
               progress < 95 ? 'Generating summary...' : 
               'Almost done...'}
            </Typography>
          </Box>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading || !file}
          sx={{ mt: 3, py: 1.5 }}
          startIcon={<CloudUploadIcon />}
        >
          {loading ? 'Processing...' : 'Upload & Process'}
        </Button>
      </form>
    </Paper>
  );
};

export default AudioUploader;