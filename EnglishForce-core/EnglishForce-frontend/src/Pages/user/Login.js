import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Divider } from '@mui/material';
import axiosInstance from '../../Api/axiosInstance';
import OAuthLoginButtons from '../../Components/OAuthLoginButtons.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Gửi yêu cầu đăng nhập
      const response = await axiosInstance.post('/auth/login', {
        username: email,
        password,
      });

      const { accessToken, refreshToken, id, role } = response.data;

      // Lưu JWT token vào localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', email);
      localStorage.setItem('userId' , id) ;
      localStorage.setItem('userRole' , role) ;
      window.location.href = '/'; // Điều hướng sau khi đăng nhập thành công
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Please sign in to your account
        </Typography>
      </Box>

      {error && <Typography color="error" textAlign="center">{error}</Typography>}

      <Box component="form" noValidate mt={3} onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="User Name"
          type="text"
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3 }}
          type="submit"
        >
          Login
        </Button>
        
        <Divider sx={{ my: 3 }}>or</Divider>
        <OAuthLoginButtons/>
        
        <Typography mt={2} textAlign="center">
          Don't have an account? <a href="/register">Register here</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
