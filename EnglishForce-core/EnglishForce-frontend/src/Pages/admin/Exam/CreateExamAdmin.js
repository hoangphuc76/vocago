import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Paper,
  Alert,
  MenuItem,
  Snackbar,
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ExamAdminCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState('general');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !duration) {
      setError('Name and Duration are required.');
      return;
    }

    try {
      const res = await axiosInstance.post('/exams', {
        name,
        description,
        duration: parseInt(duration, 10),
        type
      });

      setSuccess('Exam created successfully!');
      setTimeout(() => {
        navigate(`/admin/exams/${res.data.public_id}`);
      }, 1500);
    } catch (err) {
      console.error('Create exam error:', err);
      setError('Failed to create exam.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Exam
        </Typography>

        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>


        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Exam Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              select
              label="Exam Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="toeic">TOEIC</MenuItem>
            </TextField>
            <Box textAlign="right">
              <Button type="submit" variant="contained">
                Create Exam
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ExamAdminCreate;
