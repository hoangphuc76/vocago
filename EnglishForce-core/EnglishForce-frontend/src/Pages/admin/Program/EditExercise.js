import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

export default function EditExercise() {
  const { exercisePublicId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: '',
    type: 'single_choice',
    order_index: 0,
    thumbnail: '',
    record: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
        try {
          const res = await axiosInstance.get(`/exercises/${exercisePublicId}`);
          setFormData(res.data);
        } catch (err) {
          alert('Failed to load exercise');
        } finally {
          setLoading(false);
        }
      };
    
      fetchExercise();
  }, [exercisePublicId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/exercises/${exercisePublicId}`, formData);
      alert('Exercise updated successfully!');
      navigate('/admin/exercises'); // or any other page
    } catch (err) {
      alert('Failed to update exercise');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Edit Exercise</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Question"
          name="question"
          fullWidth
          value={formData.question}
          onChange={handleChange}
          margin="normal"
          multiline
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            label="Type"
            onChange={handleChange}
          >
            <MenuItem value="single_choice">Single Choice</MenuItem>
            <MenuItem value="speaking">Speaking</MenuItem>
            <MenuItem value="writing">Writing</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Thumbnail URL"
          name="thumbnail"
          fullWidth
          value={formData.thumbnail}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Record URL"
          name="record"
          fullWidth
          value={formData.record}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Order Index"
          name="order_index"
          type="number"
          fullWidth
          value={formData.order_index}
          onChange={handleChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Exercise
        </Button>
      </form>
    </Box>
  );
}
