import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * A reusable loading component with optional text message
 * @param {Object} props - Component props
 * @param {String} props.message - Optional loading message
 * @param {Number} props.size - Size of the circular progress (default: 40)
 * @param {String} props.color - Color of the circular progress (default: 'primary')
 */
const Loader = ({ message = 'Loading...', size = 40, color = 'primary' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        minHeight: '200px'
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;