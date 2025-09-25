import React, { useState, useRef } from 'react';
import {
  Typography, Button, Alert, Box
} from '@mui/material';

const SpeakingExercise = ({ expectedText, onResult  }) => {
  const [isListening, setIsListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [result, setResult] = useState(null);
  const recognitionRef = useRef(null);

  const checkPronunciation = (userText, expectedText) => {
    const normalize = (str) =>
      str.trim().toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);

    const userWords = normalize(userText);
    const expectedWords = normalize(expectedText);

    const minLen = Math.min(userWords.length, expectedWords.length);
    let match = 0;

    for (let i = 0; i < minLen; i++) {
      if (userWords[i] === expectedWords[i]) {
        match++;
      }
    }

    const similarity = match / expectedWords.length;
    return { similarity, isCorrect: similarity >= 0.7 };
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);
      const { similarity, isCorrect } = checkPronunciation(transcript, expectedText);
      setResult({ transcript, isCorrect, similarity });
      if (onResult) onResult({ transcript, isCorrect, similarity });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">
        Say this sentence: <strong>{expectedText}</strong>
      </Typography>

      <Button
        variant="contained"
        onClick={startListening}
        disabled={isListening}
        sx={{ mt: 1 }}
      >
        🎤 {isListening ? 'Listening...' : 'Start Speaking'}
      </Button>

      {result && (
        <Alert severity={result.isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
          You said: "{result.transcript}" <br />
          Match score: {(result.similarity * 100).toFixed(1)}% <br />
          {result.isCorrect ? "✅ Good job!" : "❌ Try again!"}
        </Alert>
      )}
    </Box>
  );
};

export default SpeakingExercise;
