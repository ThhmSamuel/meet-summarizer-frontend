import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Skeleton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  SortByAlpha as SortIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSummary } from '../context/SummaryContext';
import { useState } from 'react';

const SummaryList = () => {
  const navigate = useNavigate();
  const { summaries, loading, error, deleteSummaryById } = useSummary();
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState(null);

  const handleEditClick = (id) => {
    navigate(`/summary/${id}/edit`);
  };

  const handleViewClick = (id) => {
    navigate(`/summary/${id}`);
  };

  const handleDeleteClick = (summary) => {
    setSummaryToDelete(summary);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (summaryToDelete) {
      await deleteSummaryById(summaryToDelete._id);
      setDialogOpen(false);
      setSummaryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setSummaryToDelete(null);
  };

  const handleToggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleNewSummary = () => {
    navigate('/');
  };

  // Sort summaries based on createdAt
  const sortedSummaries = [...(summaries || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Loading skeletons
  if (loading) {
    return (
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Your Meeting Minutes</Typography>
          <Skeleton variant="rectangular" width={100} height={36} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={20} width="60%" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Skeleton variant="circular" width={36} height={36} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={36} height={36} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={36} height={36} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography color="error" sx={{ textAlign: 'center' }}>
          Error loading summaries. Please refresh the page.
        </Typography>
      </Paper>
    );
  }

  // Empty state
  if (!summaries || summaries.length === 0) {
    return (
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>No Meeting Minutes Yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload an audio recording to generate your first meeting minutes.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNewSummary}
        >
          Create New Summary
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Your Meeting Minutes</Typography>
        <Button
          size="small"
          startIcon={<SortIcon />}
          onClick={handleToggleSort}
          sx={{ textTransform: 'none' }}
        >
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {sortedSummaries.map((summary) => (
          <Box key={summary._id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Box>
                  <IconButton 
                    edge="end" 
                    aria-label="view" 
                    onClick={() => handleViewClick(summary._id)}
                    title="View"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="edit" 
                    onClick={() => handleEditClick(summary._id)}
                    title="Edit"
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={() => handleDeleteClick(summary)}
                    title="Delete"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              sx={{ py: 1.5 }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {summary.title}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Created on {format(new Date(summary.createdAt), 'MMM d, yyyy h:mm a')}
                  </Typography>
                }
              />
            </ListItem>
            <Divider component="li" />
          </Box>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Meeting Minutes?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{summaryToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SummaryList;