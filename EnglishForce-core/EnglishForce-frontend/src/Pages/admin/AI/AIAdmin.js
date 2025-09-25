import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Button, Divider, Snackbar, Alert
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import axiosInstance from '../../../Api/axiosInstance';
import GradientTitle from '../../../Components/GradientTitle';

const AdminAIPage = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleTrainModel = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/ai/recommendations-reload');
      setSnackbar({ open: true, message: 'Train successful!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Training failed!', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <GradientTitle align='left'>AI Management</GradientTitle>

      {/* Chatbot Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SmartToyIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6">Chatbot</Typography>
          </Box>
          <Typography>
            Our AI-powered chatbot helps learners by answering questions, guiding lessons, and offering explanations using natural language understanding.
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Recommendation System Section */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PsychologyIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6">Recommendation System</Typography>
          </Box>
          <Typography paragraph>
            This system suggests courses or lessons tailored to each user based on learning behavior. You can re-train the model by clicking the button below.
          </Typography>
          <Button variant="contained" onClick={handleTrainModel} disabled={loading}>
            {loading ? 'Training...' : 'Train Model'}
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminAIPage;
