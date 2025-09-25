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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../Api/axiosInstance';

const DetailLessonAdmin = () => {
  const { lessonPublicId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSection, setNewSection] = useState({
    name: '',
    description: '',
    type: '',
    order_index: 0,
  });
  const [creating, setCreating] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchLessonDetail = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/${lessonPublicId}`);
      setLesson(res.data);
    } catch (err) {
      console.error('Failed to fetch lesson detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetail();
  }, [lessonPublicId]);

  const handleDeleteExercise = async (exercisePublicId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;

    try {
      await axiosInstance.delete(`/exercises/${exercisePublicId}`);
      setSnackbar({ open: true, message: "Exercise deleted successfully", severity: "success" });
      fetchLessonDetail(); // Refresh list
    } catch (err) {
      console.error("❌ Failed to delete exercise:", err);
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Typography variant="h6" align="center" color="error" mt={5}>
        Lesson not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{lesson.name}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/lessons/edit/${lesson.public_id}`)}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {lesson.description}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Type: <strong>{lesson.type}</strong>
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Order Index: <strong>{lesson.order_index}</strong>
      </Typography>

      {/* ADD EXERCISE SECTION FORM */}
      <Box sx={{ mb: 4, p: 2, border: '1px solid gray', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Exercise
        </Typography>

        <TextField
          label="Question"
          value={newSection.question || ""}
          onChange={(e) => setNewSection({ ...newSection, question: e.target.value })}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={newSection.type || "single_choice"}
            onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
            label="Type"
          >
            <MenuItem value="single_choice">Single Choice</MenuItem>
            <MenuItem value="speaking">Speaking</MenuItem>
            <MenuItem value="writing">Writing</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Order Index"
          type="number"
          value={newSection.order_index}
          onChange={(e) =>
            setNewSection({ ...newSection, order_index: parseInt(e.target.value, 10) })
          }
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Record Text"
          value={newSection.record || ""}
          onChange={(e) => setNewSection({ ...newSection, record: e.target.value })}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            if (!newSection.question || !newSection.type) {
              alert("Missing required fields");
              return;
            }

            const formData = new FormData();
            formData.append("question", newSection.question);
            formData.append("type", newSection.type);
            formData.append("lesson_public_id", lessonPublicId);
            formData.append("order_index", newSection.order_index);

            if (newSection.record) {
              formData.append("record", newSection.record);
            }

            try {
              await axiosInstance.post("/exercises", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              setSnackbar({ open: true, message: "Exercise created", severity: "success" });
              setNewSection({});
              fetchLessonDetail();
            } catch (err) {
              console.error("Create failed:", err);
              setSnackbar({ open: true, message: "Create failed", severity: "error" });
            }
          }}
        >
          Create Exercise
        </Button>
      </Box>

      {lesson.Exercises?.length > 0 ? (
        lesson.Exercises.map((ex, index) => (
          <Card
            key={ex.public_id}
            sx={{ mb: 2 }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/admin/lessons/${lessonPublicId}/exercises/${ex.public_id}`)
              }
            >
              <Box>
                <Typography variant="subtitle1">
                  Exercise {index + 1}: {ex.question}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Type: {ex.type} | Order: {ex.order_index}
                </Typography>
              </Box>

              <IconButton
                onClick={(e) => handleDeleteExercise(ex.public_id, e)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No exercises available for this lesson.
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

export default DetailLessonAdmin;
