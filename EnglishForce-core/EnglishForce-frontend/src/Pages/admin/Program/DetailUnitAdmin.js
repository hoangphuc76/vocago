import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../Api/axiosInstance';

const DetailUnitAdmin = () => {
  const { unitPublicId } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newLesson, setNewLesson] = useState({
    name: '',
    description: '',
    order_index: 0,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchUnitDetail = async () => {
      try {
        const res = await axiosInstance.get(`/units/${unitPublicId}`);
        setUnit(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch unit:', err);
        setSnackbar({ open: true, message: 'Failed to load unit', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUnitDetail();
  }, [unitPublicId]);

  const handleCreateLesson = async () => {
    if (!newLesson.name.trim()) {
      setSnackbar({ open: true, message: 'Lesson name is required', severity: 'error' });
      return;
    }

    try {
      setCreating(true);
      await axiosInstance.post('/lessons', {
        unit_public_id: unitPublicId,
        ...newLesson,
      });

      setSnackbar({ open: true, message: 'Lesson created successfully', severity: 'success' });
      setNewLesson({ name: '', description: '', order_index: 0 });

      const res = await axiosInstance.get(`/units/${unitPublicId}`);
      setUnit(res.data);
    } catch (err) {
      console.error('Failed to create lesson:', err);
      setSnackbar({ open: true, message: 'Error creating lesson', severity: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteLesson = async (lessonPublicId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await axiosInstance.delete(`/lessons/${lessonPublicId}`);
      setSnackbar({ open: true, message: 'Lesson deleted successfully', severity: 'success' });

      const res = await axiosInstance.get(`/units/${unitPublicId}`);
      setUnit(res.data);
    } catch (error) {
      console.error('❌ Failed to delete lesson:', error);
      setSnackbar({ open: true, message: 'Failed to delete lesson', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!unit) {
    return (
      <Typography variant="h6" align="center" mt={5} color="error">
        Unit not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{unit.name}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/units/${unit.public_id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      {unit.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {unit.description}
        </Typography>
      )}

      {/* Add Lesson Section */}
      <Box sx={{ border: '1px solid gray', borderRadius: 2, p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Lesson
        </Typography>

        <TextField
          label="Lesson Name"
          fullWidth
          sx={{ mb: 2 }}
          value={newLesson.name}
          onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
          value={newLesson.description}
          onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
        />

        <TextField
          label="Order Index"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={newLesson.order_index}
          onChange={(e) =>
            setNewLesson({ ...newLesson, order_index: parseInt(e.target.value, 10) || 0 })
          }
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateLesson}
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Add Lesson'}
        </Button>
      </Box>

      {unit.Lessons?.length > 0 ? (
        unit.Lessons.map((lesson, index) => (
          <Card key={lesson.public_id} sx={{ mb: 3 }}>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/admin/lessons/${lesson.public_id}`)}
            >
              <Box>
                <Typography variant="h6">
                  Lesson {index + 1}: {lesson.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lesson.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Order: {lesson.order_index}
                </Typography>
              </Box>

              <IconButton onClick={(e) => handleDeleteLesson(lesson.public_id, e)} color="error">
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No lessons found for this unit.
        </Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default DetailUnitAdmin;
