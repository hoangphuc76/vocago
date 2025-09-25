import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Checkbox, Snackbar, Alert
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axiosInstance from "../../../Api/axiosInstance";

const QuestionAnswerAdmin = () => {
  const { questionPublicId } = useParams(); // question public_id
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState([]);
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [questionType, setQuestionType] = useState("single_choice");

  // Get question type from location state if available
  useEffect(() => {
    if (location.state?.questionType) {
      setQuestionType(location.state.questionType);
    }
  }, [location.state]);

  const fetchAnswers = async () => {
    try {
      const res = await axiosInstance.get(`/answers/by-question/${questionPublicId}`);
      setAnswers(res.data);
    } catch (error) {
      console.error("Failed to fetch answers", error);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [questionPublicId]);

  const handleAddAnswer = async () => {
    // For WRITING and SPEAKING questions, we don't require isCorrect
    const isWritingOrSpeaking = questionType === "writing" || questionType === "speaking";
    
    try {
      const res = await axiosInstance.post("/answers", {
        question_public_id: questionPublicId,
        content: newAnswerContent,
        is_correct: isWritingOrSpeaking ? undefined : isCorrect,
      });
      setAnswers([...answers, res.data]);
      setNewAnswerContent("");
      setIsCorrect(false);
      setSnackbar({ open: true, message: "Answer added!", severity: "success" });
    } catch (error) {
      console.error("Failed to add answer", error);
      setSnackbar({ open: true, message: "Failed to add answer", severity: "error" });
    }
  };

  const handleDelete = async (answerPublicId) => {
    try {
      await axiosInstance.delete(`/answers/${answerPublicId}`);
      setAnswers(answers.filter(a => a.public_id !== answerPublicId));
      setSnackbar({ open: true, message: "Answer deleted", severity: "success" });
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // For WRITING and SPEAKING questions, we don't show the correct answer checkbox
  const isWritingOrSpeaking = questionType === "writing" || questionType === "speaking";

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Manage Answers</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Add Answer</Typography>
        <TextField
          label="Answer Content"
          value={newAnswerContent}
          onChange={(e) => setNewAnswerContent(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {!isWritingOrSpeaking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Checkbox checked={isCorrect} onChange={(e) => setIsCorrect(e.target.checked)} />
            <Typography>Correct Answer</Typography>
          </div>
        )}
        <Button variant="contained" onClick={handleAddAnswer}>
          Add Answer
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Content</TableCell>
              {!isWritingOrSpeaking && <TableCell>Is Correct</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {answers.map((a, index) => (
              <TableRow key={a.public_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{a.content}</TableCell>
                {!isWritingOrSpeaking && <TableCell>{a.is_correct ? "✅" : "❌"}</TableCell>}
                <TableCell>
                  {/* Optional: Edit Button */}
                  {/* <IconButton onClick={() => navigate(`/admin/answers/${a.public_id}/edit`)}><Edit /></IconButton> */}
                  <IconButton color="error" onClick={() => handleDelete(a.public_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

export default QuestionAnswerAdmin;
