// ThemeProvider.jsx
import { useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  // Try to get the saved theme from localStorage
  const savedMode = localStorage.getItem('themeMode') || 'light';
  const [mode, setMode] = useState(savedMode); 

  // Toggle theme and persist it in localStorage
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save to localStorage
  };

  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode,
      },
    }), [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
