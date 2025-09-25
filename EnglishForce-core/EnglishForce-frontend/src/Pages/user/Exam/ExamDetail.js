import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Collapse,
  Alert,
  Slider,
} from '@mui/material';
import CircularLoading from '../../../Components/Loading';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExamDetailPage = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [fullExam, setFullExam] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [selectedParts, setSelectedParts] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [expandedPart, setExpandedPart] = useState(null);

  useEffect(() => {
    const fetchExamAndAttempts = async () => {
      try {
        // Fetch short exam info for display
        const response = await axiosInstance.get(`/exams/${publicId}/short`);
        setExam(response.data);

        // Fetch full exam details for parts selection
        const fullResponse = await axiosInstance.get(`/exams/${publicId}`);
        setFullExam(fullResponse.data);

        // Initialize selected parts (select all by default)
        const initialSelected = {};
        let totalQuestions = 0;
        fullResponse.data.parts.forEach(part => {
          initialSelected[part.public_id] = true; // Select all by default
          totalQuestions += countQuestionsInPart(part);
        });
        setSelectedParts(initialSelected);
        
        // Set default total time based on number of questions (1.5 minutes per question)
        const defaultTime = Math.max(10, Math.min(180, Math.ceil(totalQuestions * 1.5)));
        setTotalTime(defaultTime);

        const attemptRes = await axiosInstance.get(`/exam-attempts/${publicId}/user`);
        setAttempts(attemptRes.data);
      } catch (err) {
        console.error('Failed to fetch exam details', err);
      }
    };
    fetchExamAndAttempts();
  }, [publicId]);

  const countQuestionsInPart = (part) => {
    let count = part.Questions ? part.Questions.length : 0;
    if (part.Children) {
      part.Children.forEach(child => {
        count += countQuestionsInPart(child);
      });
    }
    return count;
  };

  const getTotalQuestions = () => {
    if (!fullExam) return 0;
    let total = 0;
    fullExam.parts.forEach(part => {
      total += countQuestionsInPart(part);
    });
    return total;
  };

  const getSelectedQuestions = () => {
    if (!fullExam) return 0;
    let total = 0;
    fullExam.parts.forEach(part => {
      if (selectedParts[part.public_id]) {
        total += countQuestionsInPart(part);
      }
    });
    return total;
  };

  const handlePartSelection = (partId, checked) => {
    setSelectedParts(prev => ({
      ...prev,
      [partId]: checked
    }));
    
    // Recalculate total time based on selected questions (1.5 minutes per question)
    const selectedQuestions = getSelectedQuestions();
    const newTotalTime = Math.max(10, Math.min(180, Math.ceil(selectedQuestions * 1.5)));
    setTotalTime(newTotalTime);
  };

  const handleTimeChange = (time) => {
    setTotalTime(time);
  };

  const handleStartPractice = () => {
    // Get selected parts
    const selectedPartsData = fullExam.parts
      .filter(part => selectedParts[part.public_id]);

    if (selectedPartsData.length === 0) {
      alert('Please select at least one part to practice');
      return;
    }

    // Check if all parts are selected
    const areAllPartsSelected = selectedPartsData.length === fullExam.parts.length;

    // Navigate to exam start page with appropriate data
    navigate(`/exams/${publicId}/start`, {
      state: {
        // Pass fullExam when all parts are selected, otherwise pass only selected parts
        fullExam: areAllPartsSelected ? fullExam : null,
        selectedParts: selectedPartsData,
        totalDuration: totalTime
      }
    });
  };

  const togglePartExpansion = (partId) => {
    setExpandedPart(expandedPart === partId ? null : partId);
  };

  const renderPartRecursively = (part, level = 0) => {
    const isSelected = selectedParts[part.public_id];
    const questionCount = countQuestionsInPart(part);

    return (
      <Card key={part.public_id} sx={{ mb: 2, ml: level * 2 }}>
        <CardHeader
          title={
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSelected || false}
                  onChange={(e) => handlePartSelection(part.public_id, e.target.checked)}
                />
              }
              label={
                <Typography variant="h6" component="span">
                  {part.name} ({questionCount} questions)
                </Typography>
              }
            />
          }
          action={
            <IconButton onClick={() => togglePartExpansion(part.public_id)}>
              <ExpandMoreIcon />
            </IconButton>
          }
          sx={{ pb: 0 }}
        />
        <Collapse in={expandedPart === part.public_id} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {part.description}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  };

  if (!exam || !fullExam) return <CircularLoading />;

  const totalQuestions = getTotalQuestions();
  const selectedQuestions = getSelectedQuestions();

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: '#f9fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box mb={6}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          {exam.name}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Chip
            label={exam.type === 'toeic' ? 'TOEIC Exam' : 'General Exam'}
            color={exam.type === 'toeic' ? 'primary' : 'default'}
            icon={<QuizIcon />}
          />
          <Chip
            label={`${exam.duration} minutes (Full Exam)`}
            variant="outlined"
            icon={<AccessTimeIcon />}
          />
        </Stack>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
          {exam.description}
        </Typography>
      </Box>

      {/* Part Selection */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Select Parts to Practice
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Select the parts you want to practice. Total questions: {selectedQuestions}/{totalQuestions}
        </Alert>

        <Box sx={{ mb: 3 }}>
          {fullExam.parts.map(part => renderPartRecursively(part))}
        </Box>

        {/* Time Selection */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Practice Duration: {totalTime} minutes
          </Typography>
          <Slider
            value={totalTime}
            onChange={(e, newValue) => handleTimeChange(newValue)}
            min={10}
            max={exam.duration}
            step={5}
            marks={[
              { value: 10, label: '10m' },
              { value: 30, label: '30m' },
              { value: 60, label: '60m' },
              { value: 90, label: '90m' },
              { value: 120, label: '120m' },
              { value: 150, label: '150m' },
              { value: 180, label: '180m' },
              { value: exam.duration, label: `${exam.duration}m` }
            ]}
            valueLabelDisplay="auto"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Recommended time: ~{Math.ceil(selectedQuestions * 1.5)} minutes ({selectedQuestions} questions × 1.5 minutes)
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleStartPractice}
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
            background: 'linear-gradient(to right, #1976d2, #00c6ff)',
            boxShadow: '0 0 12px rgba(25, 118, 210, 0.4)',
            '&:hover': {
              background: 'linear-gradient(to right, #1565c0, #00bcd4)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Start Practice ({totalTime} minutes)
        </Button>
      </Box>

      {/* Attempt History */}
      {attempts.length > 0 && (
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            <HistoryIcon sx={{ mr: 1 }} /> Your Attempts
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            {attempts.map((attempt, index) => (
              <Paper
                key={attempt.id}
                elevation={3}
                sx={{
                  p: 2,
                  borderLeft: '4px solid #1976d2',
                  background: '#ffffff',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight={600}>
                    Attempt #{index + 1}
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`Score: ${attempt.score} / 100`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Time: {new Date(attempt.start).toLocaleString()} →{' '}
                  {new Date(attempt.end).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ExamDetailPage;
