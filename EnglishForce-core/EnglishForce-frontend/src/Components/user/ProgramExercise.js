import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
  Box,
  Stack,
  Paper,
  LinearProgress
} from '@mui/material';
import axiosInstance from '../../Api/axiosInstance';
import SpeakingExercise from './SpeakingExercise';

const ExerciseCard = ({
  exercise,
  index,
  total,
  onAnswerChecked,
  handleNext,
  isLast,
}) => {
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [userText, setUserText] = useState('');
  const [speakingResult, setSpeakingResult] = useState(null);
  const correctSound = new Audio("/correct-sound.mp3");
  const wrongSound = new Audio("/wrong-sound.mp3");

  useEffect(() => {
    setSelectedAnswerId(null);
    setUserText('');
    setSpeakingResult(null);
    setIsCorrect(null);
    setShowResult(false);
  }, [exercise]);

  const handleCheckAnswer = async () => {
    if (!exercise) return;

    if (exercise.type === 'single_choice') {
      if (!selectedAnswerId) return;
      const answer = exercise.ExerciseAnswers.find(a => a.id === selectedAnswerId);
      if (!answer) return;
      setIsCorrect(answer.is_correct);
      setShowResult(true);
      if (answer.is_correct) onAnswerChecked(answer.is_correct);


      if (answer.is_correct) correctSound.play();
      else wrongSound.play();
    }

    else if (exercise.type === 'writing') {
      if (!userText.trim()) return;
      try {
        const res = await axiosInstance.post('/AI/check-writing', {
          question: exercise.question,
          userAnswer: userText
        });
        const isCorrect = res.data === 1;
        setIsCorrect(isCorrect);
        setShowResult(true);
        if (isCorrect) onAnswerChecked(isCorrect);

        if (isCorrect) correctSound.play();
        else wrongSound.play();        
      } catch (error) {
        console.error("Gemini API error:", error);
        alert("An error occurred while grading.");
        setIsCorrect(false);
        setShowResult(true);
      }
    }

    else if (exercise.type === 'speaking') {
      if (!speakingResult) return;
      setIsCorrect(speakingResult.isCorrect);
      setShowResult(true);
      if (speakingResult.isCorrect) onAnswerChecked(speakingResult.isCorrect);

      if (speakingResult.isCorrect) correctSound.play();
      else wrongSound.play();
    }
  };

  const renderAnswerSection = () => {
    switch (exercise.type) {
      case 'single_choice':
        return (
          <Stack spacing={1} mt={2}>
            <RadioGroup
              value={selectedAnswerId}
              onChange={(e) => setSelectedAnswerId(parseInt(e.target.value))}
            >
              {exercise.ExerciseAnswers.map((ans) => (
                <Paper
                  key={ans.id}
                  elevation={selectedAnswerId === ans.id ? 4 : 1}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    transition: '0.2s',
                    bgcolor: showResult && ans.is_correct ? '#d0f0c0' : 'white'
                  }}
                >
                  <FormControlLabel
                    value={ans.id}
                    control={<Radio />}
                    label={ans.content}
                    disabled={showResult}
                    sx={{ width: '100%', ml: 1 }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </Stack>
        );
      case 'writing':
        return (
          <TextField
            label="Your Answer"
            fullWidth
            multiline
            minRows={4}
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            disabled={showResult}
            sx={{ mt: 2 }}
          />
        );
      case 'speaking':
        return (
          <Box mt={2}>
            <SpeakingExercise
              expectedText={exercise.question}
              onResult={setSpeakingResult}
            />
          </Box>
        );
      default:
        return <Typography color="error">Unsupported exercise type.</Typography>;
    }
  };

  return (
    <Card
      elevation={6}
      sx={{
        borderRadius: 4,
        p: 3,
        mb: 4,
        background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
      }}
    >
<Box>
  <Typography variant="body2" fontWeight="bold">
    Progress: {index + 1} / {total}
  </Typography>
  <LinearProgress
    variant="determinate"
    value={((index + 1) / total) * 100}
    sx={{ height: 10, borderRadius: 5, mb: 2 }}
  />
</Box>


      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            🧠 Question {index + 1}
          </Typography>

          <Typography sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
            {exercise.question}
          </Typography>

          {exercise.thumbnail && (
            <Avatar
              variant="rounded"
              src={exercise.thumbnail}
              alt="thumbnail"
              sx={{ width: 140, height: 140, alignSelf: 'center', my: 2 }}
            />
          )}

          {exercise.record && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(exercise.record);
                utterance.volume = 1;
                speechSynthesis.speak(utterance);
              }}
              sx={{
                maxWidth: 200,
                alignSelf: 'left',
                px: 2,
                py: 1,
                borderRadius: 3,
                textTransform: 'none',
              }}
            >
              🔊 Listen
            </Button>
          )}

          <Chip
            label={exercise.type.replace('_', ' ').toUpperCase()}
            color="primary"
            size="medium"
            sx={{ width: 'fit-content', alignSelf: 'flex-start' }}
          />

          {renderAnswerSection()}

          {showResult && (
            <>
              {exercise.type !== 'speaking' && (
                <Alert severity={isCorrect ? 'success' : 'error'}>
                  {isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
                </Alert>
              )}
              {exercise.explanation && (
                <Alert severity="info">
                  📘 Explanation: {exercise.explanation}
                </Alert>
              )}
            </>
          )}

          {!showResult ? (
            <Button
              variant="contained"
              onClick={handleCheckAnswer}
              disabled={
                exercise.type === 'single_choice' ? selectedAnswerId === null :
                  exercise.type === 'writing' ? userText.trim() === '' :
                    exercise.type === 'speaking' ? speakingResult === null :
                      false
              }
              sx={{ alignSelf: 'flex-end' }}
            >
              ✅ Submit
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleNext}
              sx={{ alignSelf: 'flex-end' }}
            >
              {isLast ? '🏁 End Lesson' : '➡️ Next'}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
