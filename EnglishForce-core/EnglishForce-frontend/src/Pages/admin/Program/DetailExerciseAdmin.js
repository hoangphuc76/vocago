import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Chip,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Paper,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../Api/axiosInstance';

const DetailExerciseAdmin = () => {
  const { exercisePublicId } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState({ content: '', is_correct: false });
  const [adding, setAdding] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const res = await axiosInstance.get(`/exercises/${exercisePublicId}`);
        setExercise(res.data);
      } catch (err) {
        console.error('Failed to fetch exercise detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [exercisePublicId]);

  const handleAddAnswer = async () => {
    if (!newAnswer.content.trim()) return;

    try {
      setAdding(true);
      const res = await axiosInstance.post('/exercise-answers', {
        exercise_public_id: exercisePublicId,
        content: newAnswer.content,
        is_correct: newAnswer.is_correct,
      });

      setExercise(prev => ({
        ...prev,
        ExerciseAnswers: [...(prev.ExerciseAnswers || []), res.data]
      }));

      setNewAnswer({ content: '', is_correct: false });
      setSnackbar({ open: true, message: 'Answer added successfully!', severity: 'success' });
    } catch (err) {
      console.error('Failed to add answer:', err);
      setSnackbar({ open: true, message: 'Failed to add answer', severity: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAnswer = async (answerPublicId) => {
    try {
      await axiosInstance.delete(`/exercise-answers/${answerPublicId}`);
      setExercise(prev => ({
        ...prev,
        ExerciseAnswers: prev.ExerciseAnswers.filter(a => a.public_id !== answerPublicId)
      }));
      setSnackbar({ open: true, message: 'Answer deleted!', severity: 'success' });
    } catch (err) {
      console.error('Delete failed', err);
      setSnackbar({ open: true, message: 'Failed to delete answer', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!exercise) {
    return (
      <Typography variant="h6" align="center" color="error" mt={5}>
        Exercise not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Exercise Detail</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/exercises/${exercise.public_id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>{exercise.question}</Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Type: <strong>{exercise.type}</strong>
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Order Index: <strong>{exercise.order_index}</strong>
      </Typography>

      {exercise.thumbnail && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2">Thumbnail:</Typography>
          <img
            src={exercise.thumbnail}
            alt="Exercise Thumbnail"
            style={{ width: '100%', borderRadius: 4 }}
          />
        </Box>
      )}

      {exercise.record && (
          <Typography variant="body2">Record: {exercise.record}</Typography>
      )}


      {/* Section: Add Answer */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>Add New Answer</Typography>
        <Paper sx={{ p: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Answer Content"
            value={newAnswer.content}
            onChange={(e) => setNewAnswer(prev => ({ ...prev, content: e.target.value }))}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAnswer.is_correct}
                onChange={(e) =>
                  setNewAnswer(prev => ({ ...prev, is_correct: e.target.checked }))
                }
              />
            }
            label="Is Correct Answer?"
          />
          <Box mt={2}>
            <Button variant="contained" onClick={handleAddAnswer} disabled={adding}>
              {adding ? 'Adding...' : 'Add Answer'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>Answers</Typography>
      {exercise.ExerciseAnswers?.length > 0 ? (
        exercise.ExerciseAnswers.map((answer) => (
          <Card key={answer.public_id} sx={{ mb: 2, position: 'relative' }}>
            <CardContent
              onClick={() =>
                navigate(`/admin/exercises/${exercise.public_id}/answer/${answer.public_id}`)
              }
              style={{ cursor: 'pointer' }}
            >
              <Typography variant="body1">{answer.content}</Typography>
              {answer.is_correct && (
                <Chip label="Correct" color="success" size="small" sx={{ mt: 1 }} />
              )}
            </CardContent>
            <IconButton
              color="error"
              size="small"
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={(e) => {
                e.stopPropagation(); // ngăn điều hướng khi bấm delete
                handleDeleteAnswer(answer.public_id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No answers available.
        </Typography>
      )}


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default DetailExerciseAdmin;
