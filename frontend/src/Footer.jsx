// src/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        padding: 2,
        marginTop: 4,
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        &copy; 2025 Your Company. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
