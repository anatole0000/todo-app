import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { useThemeContext } from './ThemeContext';
import { Home, ListAlt, Settings, AccountCircle, EmojiNature } from '@mui/icons-material'; // Add an icon for joke generator
import { Link } from 'react-router-dom'; // Make sure you have React Router installed

const Header = () => {
  const { toggleTheme, mode } = useThemeContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Todo App
        </Typography>

        {/* Navigation Links with Icons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton component={Link} to="/" color="inherit">
            <Home />
          </IconButton>
          <IconButton component={Link} to="/todos" color="inherit">
            <ListAlt />
          </IconButton>
          <IconButton component={Link} to="/settings" color="inherit">
            <Settings />
          </IconButton>
          <IconButton component={Link} to="/profile" color="inherit">
            <AccountCircle />
          </IconButton>
          <IconButton component={Link} to="/joke" color="inherit"> {/* Link for Joke Generator */}
            <EmojiNature /> {/* Use an appropriate icon for the joke generator */}
          </IconButton>
        </Box>

        {/* Dark Mode Toggle Button */}
        <Button 
          color="inherit" 
          onClick={toggleTheme} 
        >
          {mode === 'light' ? '🌙 Dark Mode' : '🌞 Light Mode'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
