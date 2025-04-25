// src/components/Header.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import { 
  TextSnippet as TextSnippetIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };
  
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
            {isAuthenticated ? (
              <>
                <Button 
                  component={RouterLink} 
                  to="/" 
                  color="primary"
                  sx={{ marginRight: 2 }}
                >
                  Dashboard
                </Button>
                
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
                
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem sx={{ pointerEvents: 'none' }}>
                    <Typography variant="body2">
                      Signed in as <strong>{currentUser?.email}</strong>
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} component={RouterLink} to="/settings">
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Sign In
                </Button>
                
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;