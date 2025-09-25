import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Container
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";
import CircularLoading from "../../../Components/Loading";

const EditExerciseAnswerAdmin = () => {
  const { answerPublicId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    content: "",
    is_correct: false,
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axiosInstance
      .get(`/exercise-answers/${answerPublicId}`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch answer", err);
        setSnackbar({ open: true, message: "Failed to load answer", severity: "error" });
        setLoading(false);
      });
  }, [answerPublicId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.put(`/exercise-answers/${answerPublicId}`, form);
      setSnackbar({ open: true, message: "Answer updated successfully", severity: "success" });
      setTimeout(() => navigate(-1), 1500); // Quay lại trang trước sau khi lưu
    } catch (err) {
      console.error("Update failed", err);
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    }
  };

  if (loading) return <CircularLoading />;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Edit Exercise Answer</Typography>
        <TextField
          fullWidth
          label="Answer Content"
          name="content"
          value={form.content}
          onChange={handleChange}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.is_correct}
              onChange={handleChange}
              name="is_correct"
            />
          }
          label="Is Correct Answer?"
        />
        <Box mt={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Paper>

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

export default EditExerciseAnswerAdmin;
