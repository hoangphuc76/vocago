// Detail Part : Infor of one part, children part list 

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Accordion, AccordionSummary, AccordionDetails, IconButton, Divider, Card, CardContent, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Visibility, Delete } from "@mui/icons-material";

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ExamPartDetailAdmin = () => {
  const { partPublicId, publicId } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newChildPartName, setNewChildPartName] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');

  const fetchPartDetail = async () => {
    try {
      const res = await axiosInstance.get(`/exam-parts/${partPublicId}`);
      setPart(res.data);
    } catch (error) {
      console.error('Error fetching part detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartDetail();
  }, [partPublicId]);


  const handleAddChildPart = async () => {
    try {
      await axiosInstance.post(`/exam-parts`, {
        exam_public_id: publicId,
        name: newChildPartName,
        parent_part_public_id: part.public_id
      });
      setNewChildPartName('');
      fetchPartDetail();
    } catch (error) {
      console.error('Error adding child part:', error);
    }
  };

  const handleDeleteChildPart = async (childPublicId) => {
    if (!window.confirm('Are you sure you want to delete this child part?')) return;
    try {
      await axiosInstance.delete(`/exam-parts/${childPublicId}`);
      fetchPartDetail();
    } catch (error) {
      console.error('Error deleting child part:', error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      await axiosInstance.post(`/questions`, {
        examPartPublicId: part.public_id,
        content: newQuestionContent,
        type: 'single_choice' // default type, you can add a select input later
      });
      setNewQuestionContent('');
      fetchPartDetail();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleDeleteQuestion = async (questionPublicId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await axiosInstance.delete(`/questions/${questionPublicId}`);
      fetchPartDetail();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!part) {
    return <Typography variant="h6">Part not found</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Part Info */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h4">{part.name}</Typography>
          <Typography variant="body1">{part.description}</Typography>
        </Box>
        <IconButton onClick={() => navigate(`/admin/exams/${publicId}/parts/${partPublicId}/edit`)}>
          <EditIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Children Parts */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Child Parts</Typography>

        {part.Children?.length > 0 ? (
          part.Children.map((child) => (
            <Box
              key={child.public_id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={1}
              border={1}
              borderColor="divider"
              borderRadius={2}
              mb={1}
            >
              {/* Tên Child Part */}
              <Typography>{child.name}</Typography>

              {/* Các Icon hành động */}
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/admin/exams/${publicId}/parts/${child.public_id}`)}
                >
                  <Visibility fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteChildPart(child.public_id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No child parts yet.</Typography>
        )}

        {/* Add Child Part */}
        <Box display="flex" mt={2}>
          <TextField
            label="New Child Part Name"
            value={newChildPartName}
            onChange={(e) => setNewChildPartName(e.target.value)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddChildPart}
            disabled={!newChildPartName}
          >
            Add Child Part
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />


      {/* Back to Exam */}
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          component={Link}
          to={`/admin/exams/${publicId}/parts/${partPublicId}/questions`}
        >
          Edit Questions
        </Button>
        <Button
          variant="contained"
          color="info"
          sx={{ mr: 2 }}
          component={Link}
          to={`/admin/exams/${publicId}/parts`}
        >
          Edit Exam Parts
        </Button>
        <Button variant="contained" component={Link} to={`/admin/exams/${part.examPublicId}`}>
          Back to Exam
        </Button>
      </Box>
    </Container>
  );
};

export default ExamPartDetailAdmin;
