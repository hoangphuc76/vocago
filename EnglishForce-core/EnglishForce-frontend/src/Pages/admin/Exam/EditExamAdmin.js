import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";

const EditExamPage = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const [examData, setExamData] = useState({
    name: "",
    description: "",
    duration: 30, // default 30 phút
    type: "general",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch exam info
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axiosInstance.get(`/exams/${publicId}/short`);
        const data = res.data;
        setExamData({
          name: data.name || "",
          description: data.description || "",
          duration: data.duration || 30,
          type: data.type || "general"
        });
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError("Could not load exam.");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [publicId]);

  const handleChange = (e) => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/exams/${publicId}`, examData);
      navigate(`/admin/exams/${publicId}`);
    } catch (err) {
      console.error("Error updating exam:", err);
      setError("Could not update exam.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Exam
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Exam Name"
            name="name"
            fullWidth
            margin="normal"
            value={examData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={examData.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            inputProps={{ min: 1 }}
            fullWidth
            margin="normal"
            value={examData.duration}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Exam Type"
            name="type"
            fullWidth
            margin="normal"
            value={examData.type}
            onChange={handleChange}
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="toeic">TOEIC</MenuItem>
          </TextField>
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditExamPage;
