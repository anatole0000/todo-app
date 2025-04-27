import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';

const AuthForm = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
      await axios.post(url, { username, password }, { withCredentials: true });
      onAuthSuccess(); // call parent to refresh todos
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isLogin ? 'Login' : 'Register'}
      </Typography>
      <form onSubmit={handleAuth}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {isLogin ? 'Login' : 'Register'}
        </Button>
        <Button
          variant="text"
          fullWidth
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 2 }}
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
      </form>
    </Box>
  );
};

export default AuthForm;
