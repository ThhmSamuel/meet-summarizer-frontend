import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box
} from '@mui/material';
import { TextSnippet as TextSnippetIcon } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'primary.main' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextSnippetIcon sx={{ fontSize: 32, marginRight: 1 }} />
            <Typography
              component={RouterLink}
              to="/"
              variant="h6"
              sx={{
                fontWeight: 700,
                textDecoration: 'none',
                color: 'inherit',
                letterSpacing: '0.5px',
                fontSize: '1.5rem'
              }}
            >
              Meeting Minutes
            </Typography>
          </Box>
          
          <Box>
            <Button 
              component={RouterLink} 
              to="/" 
              color="primary"
              sx={{ marginRight: 2 }}
            >
              Dashboard
            </Button>
            
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              color="primary"
              disableElevation
            >
              New Summary
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;