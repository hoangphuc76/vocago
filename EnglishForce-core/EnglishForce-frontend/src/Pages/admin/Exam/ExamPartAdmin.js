// Hơi giống trang Detail Exam 
// Exam Part: Part List , Add Part Section , Detail Part Button 
// Detail Exam: Exam info , part list , button to redirect to this page , Edit exam Button

import React, { useEffect, useState } from "react";
import {
  Container, Typography, Paper, Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Snackbar, Alert, Box, Button, TextField, IconButton
} from "@mui/material";
import CircularLoading from "../../../Components/Loading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { Visibility } from "@mui/icons-material";
import axiosInstance from "../../../Api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const ExamPartDetailAdmin = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [newPartName, setNewPartName] = useState("");
  const [newPartDesc, setNewPartDesc] = useState("");

  useEffect(() => {
    fetchExamDetails();
  }, [publicId]);

  const fetchExamDetails = async () => {
    try {
      const res = await axiosInstance.get(`/exams/${publicId}`);
      setExam(res.data);
    } catch (error) {
      console.error("Failed to fetch exam parts", error);
      setSnackbar({ open: true, message: "Error loading exam data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePart = async () => {
    if (!newPartName.trim()) return;

    try {
      const res = await axiosInstance.post("/exam-parts", {
        exam_public_id: publicId,
        name: newPartName,
        description: newPartDesc,
      });

      setExam(prev => ({
        ...prev,
        parts: [...prev.parts, res.data]
      }));

      setNewPartName("");
      setNewPartDesc("");
      setSnackbar({ open: true, message: "Exam Part created", severity: "success" });
    } catch (err) {
      console.error("Create failed", err);
      setSnackbar({ open: true, message: "Failed to create Exam Part", severity: "error" });
    }
  };

  const handleDeletePart = async (partPublicId) => {
    if (!window.confirm("Are you sure to delete this part?")) return;
    try {
      await axiosInstance.delete(`/exam-parts/${partPublicId}`);
      setExam(prev => ({
        ...prev,
        parts: prev.parts.filter(p => p.public_id !== partPublicId)
      }));
      setSnackbar({ open: true, message: "Deleted successfully", severity: "success" });
    } catch (err) {
      console.error("Delete failed", err);
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  const renderQuestions = (questions) => (
    <Box sx={{ mt: 2 }}>
      {questions.map((q, qIdx) => (
        <Box key={q.id} sx={{ mb: 3 }}>
          <Typography>{qIdx + 1}. {q.content} ({q.type})</Typography>
          {q.thumbnail && (
            <img
              src={q.thumbnail}
              alt="thumbnail"
              style={{ width: 100, marginTop: 8, borderRadius: 4 }}
            />
          )}
          {q.record && (
            <audio controls style={{ display: "block", marginTop: 8 }}>
              <source src={q.record} type="audio/mpeg" />
            </audio>
          )}
          <Box sx={{ mt: 1, pl: 2 }}>
            {q.Answers?.map(ans => (
              <Typography
                key={ans.id}
                variant="body2"
                sx={{ color: ans.is_correct ? "green" : "text.primary" }}
              >
                - {ans.content} {ans.is_correct && "(Correct)"}
              </Typography>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );

  const renderPartRecursive = (part) => (
    <Accordion key={part.id} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h6">{part.name}</Typography>
          <Box>
            <IconButton color="info" onClick={() => navigate(`/admin/exams/${publicId}/parts/${part.public_id}`)}>
              <Visibility />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePart(part.public_id);
              }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {part.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {part.description}
          </Typography>
        )}
        {part.Questions && part.Questions.length > 0 && renderQuestions(part.Questions)}
        {part.Children && part.Children.length > 0 && (
          <Box sx={{ mt: 2, ml: 2 }}>
            {part.Children.map(child => renderPartRecursive(child))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  if (loading) return <CircularLoading/>;

  if (!exam) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">Exam not found or no parts available.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Manage Exam Parts</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">{exam.name}</Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>{exam.description}</Typography>
        <Typography variant="body2">Duration: {exam.duration} minutes</Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Create New Exam Part</Typography>
        <TextField
          label="Part Name"
          value={newPartName}
          onChange={(e) => setNewPartName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={newPartDesc}
          onChange={(e) => setNewPartDesc(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleCreatePart}>Add Part</Button>
      </Paper>

      {/* Render all parts */}
      {exam.parts.map(part => renderPartRecursive(part))}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ExamPartDetailAdmin;
