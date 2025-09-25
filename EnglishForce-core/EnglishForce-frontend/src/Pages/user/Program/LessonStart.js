import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box, Typography, Divider, Button, Paper, Stack, Fade,
} from '@mui/material';
import ExerciseCard from '../../../Components/user/ProgramExercise';
import CircularLoading from '../../../Components/Loading';

const LessonCompleted = ({ score, exercises }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        p: 2
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 4
        }}
      >
        <Stack spacing={3}>
          <Box
            component="img"
            src="/LessonCompleted/download.jpg"
            alt="Lesson Completed"
            sx={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'contain',
              borderRadius: 4,
              mx: 'auto',
              caretColor: "transparent",

            }}
          />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#1976d2' }}>
              🎉 Lesson Completed!
            </Typography>

          <Typography variant="h6">
            You answered <b>{score}</b> out of <b>{exercises.length}</b> questions correctly.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 3 }}
            onClick={() => navigate(-1)}
          >
            🔙 Back to Unit
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

const LessonStartPage = () => {
  const { lessonPublicId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);


  const fetchLessonDetail = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/${lessonPublicId}`);
      setLesson(res.data);
      setExercises(res.data.Exercises || []);
    } catch (error) {
      console.error('❌ Failed to fetch lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetail();
  }, [lessonPublicId]);

  const currentExercise = exercises[currentIndex];


  const handleNext = async () => {
    const isLast = currentIndex === exercises.length - 1;
    if (isLast) {
      setFinished(true);
      try {
        await axiosInstance.post('/user-progresses', {
          lessonPublicId: lesson.public_id,
          score: (Number(score) / Number(exercises.length)).toFixed(2),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBackToLesson = () => {
    // navigate(`/programs/${lesson?.Unit?.program_id}/units/${lesson?.unit_id}`);
  };

  if (loading) return <CircularLoading />;

  if (!lesson || exercises.length === 0) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={4}>
        No exercises found for this lesson.
      </Typography>
    );
  }

  if (finished) {
    return (
      <LessonCompleted score={score} exercises={exercises} />
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        sx={{
          background: 'linear-gradient(to right, #1976d2, #d81b60)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}
      >
        {lesson.name}
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        {lesson.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <ExerciseCard
        exercise={currentExercise}
        index={currentIndex}
        total={exercises.length} 
        handleNext={handleNext}
        isLast={currentIndex === exercises.length - 1}
        onAnswerChecked={(isCorrect) => {
          if (isCorrect) setScore(prev => prev + 1);
        }}
      />
    </Box>
  );
};

export default LessonStartPage;
