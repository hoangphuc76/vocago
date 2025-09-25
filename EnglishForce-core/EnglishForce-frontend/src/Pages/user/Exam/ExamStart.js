import isHtml from 'is-html';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  Button,
  Checkbox,
  Radio,
  FormControlLabel,
  CircularProgress,
  Stack,
  Alert,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import ExamMenu from '../../../Components/user/ExamMenu';
import AudioRecorder from '../../../Components/user/AudioRecorder';
import CircularLoading from '../../../Components/Loading';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ExamStartPage = () => {
  const { publicId } = useParams();
  const location = useLocation();
  const [exam, setExam] = useState(null);
  const [displayParts, setDisplayParts] = useState([]); // Parts to display based on selection
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      if (location.state?.fullExam) {
        setExam(location.state.fullExam);
        if (location.state?.selectedParts) {
          // Use selected parts
          setDisplayParts(location.state.selectedParts);
        }
        return;
      }

      try {
        const response = await axiosInstance.get(`/exams/${publicId}`);
        setExam(response.data);

        // Check if we have selected parts from location state
        if (location.state?.selectedParts) {
          // Use selected parts
          setDisplayParts(location.state.selectedParts);
        } else {
          // Default to all parts
          setDisplayParts(response.data.parts);
        }
      } catch (err) {
        console.error('Failed to fetch exam details', err);
      }
    };
    fetchExam();
  }, [publicId, location.state]);

  // Warn users when they try to leave the page.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // cần thiết để Chrome hiển thị popup xác nhận
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSelectAnswer = (questionPublicId, answerPublicId, type) => {
    setAnswers((prev) => {
      if (type === 'multiple_choice') {
        const current = prev[questionPublicId] || [];
        return {
          ...prev,
          [questionPublicId]: current.includes(answerPublicId)
            ? current.filter((id) => id !== answerPublicId)
            : [...current, answerPublicId],
        };
      } else {
        return {
          ...prev,
          [questionPublicId]: [answerPublicId],
        };
      }
    });
  };

  const handleTextAnswerChange = (questionPublicId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionPublicId]: { type: 'writing', text },
    }));
  };

  const handleAudioAnswerChange = (questionPublicId, audioBlob, audioUrl) => {
    setAnswers((prev) => ({
      ...prev,
      [questionPublicId]: { type: 'speaking', audio: audioBlob, audioUrl: audioUrl },
    }));
  };

  const handleManualAudioUrlChange = (questionPublicId, url) => {
    setAnswers((prev) => ({
      ...prev,
      [questionPublicId]: { type: 'speaking', audioUrl: url },
    }));
  };
  // answers sẽ có dạng :
  // {
  //   'question-public-id-1': ['answer-id-1', 'answer-id-2'], // nếu multiple
  //   'question-public-id-2': ['answer-id-3']                 // nếu single
  // }

  const handleSubmit = async (start = null, end = null) => {
    try {
      setLoading(true);
      
      // Separate regular answers from writing/speaking answers
      const regularAnswers = [];
      const writingAnswers = [];
      const speakingAnswers = [];
      
      Object.entries(answers).forEach(([question_public_id, answer_data]) => {
        if (Array.isArray(answer_data)) {
          // Regular multiple/single choice answers
          regularAnswers.push({
            question_public_id,
            answer_ids: answer_data
          });
        } else if (answer_data.type === 'writing') {
          writingAnswers.push({
            question_public_id,
            text_answer: answer_data.text
          });
        } else if (answer_data.type === 'speaking') {
          speakingAnswers.push({
            question_public_id,
            audio_record_url: answer_data.audioUrl || 'placeholder_audio_url'
          });
        }
      });
      
      const payload = {
        exam_public_id: publicId,
        answers: regularAnswers,
        writing_answers: writingAnswers,
        speaking_answers: speakingAnswers
      };
      
      if (start) payload.start = start;
      if (end) payload.end = end;

      // Submit all answers in one request
      const Response = await axiosInstance.post('/exams/attempts', payload);

      // Build selected answer content
      const selectedAnswerContents = [];

      const extractQuestions = (part) => {
        part.Questions?.forEach((question) => {
          if (question.type === 'writing' || question.type === 'speaking') {
            // For writing and speaking, we store the actual answer content
            const answerData = answers[question.public_id];
            selectedAnswerContents.push({
              question_public_id: question.public_id,
              question_content: question.content,
              selected_answers: answerData ? [answerData.text || answerData.audioUrl || 'Answer recorded'] : ['No answer provided']
            });
          } else {
            // For regular questions
            const selected = question.Answers.filter((a) =>
              answers[question.public_id]?.includes(a.public_id)
            );
            selectedAnswerContents.push({
              question_public_id: question.public_id,
              question_content: question.content,
              selected_answers: selected.map((a) => a.content)
            });
          }
        });

        part.Children?.forEach((childPart) => {
          extractQuestions(childPart); // Đệ quy
        });
      };

      displayParts.forEach((part) => {
        extractQuestions(part);
      });

      // console.log(selectedAnswerContents);
      navigate(`/exams/${publicId}/result/${Response.data.attemptPublicId}`, {
        state: { selectedAnswers: selectedAnswerContents }
      });
    } catch (err) {
      console.error('Submit failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return <CircularLoading />;

  // Calculate total duration for selected parts
  const totalDuration = location.state?.totalDuration || exam.duration;

  let globalQuestionIndex = 1; // Biến toàn cục ngoài component hoặc ở đầu trong component nếu không tách file

  const renderPartRecursively = (part, indexPath = '') => (
    <Box key={part.public_id} mb={5}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }} fontWeight={700} >
        Exam Part {indexPath}: {part.name}
      </Typography>

      {typeof part.description === 'string' && isHtml(part.description) ? <div dangerouslySetInnerHTML={{ __html: part.description }} />
        : <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {part.description}
        </Typography>
      }

      {part.thumbnail && (
        <Box my={2}>
          <Typography fontStyle="italic" color="text.secondary">Part Thumbnail:</Typography>
          <img src={part.thumbnail} alt="Part thumbnail" style={{ maxWidth: 600, borderRadius: '8px' }} />
        </Box>
      )}

      {part.record && (
        <Box my={2}>
          <Typography fontStyle="italic" color="text.secondary">Part Record:</Typography>
          <audio controls src={part.record} style={{ width: "100%" }} />
        </Box>
      )}

      {part.Questions?.map((question) => {
        const rendered = (
          <Paper key={question.public_id} id={question.public_id} elevation={3} sx={{ p: 3, my: 3, borderLeft: '6px solid #1976d2' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Question {globalQuestionIndex}
            </Typography>
            <Typography variant="body1" gutterBottom>{question.content}</Typography>

            {question.thumbnail && (
              <Box my={2}>
                <img src={question.thumbnail} alt="Question illustration" style={{ maxWidth: '100%', borderRadius: '8px' }} />
              </Box>
            )}

            {question.record && (
              <Box my={2}>
                <audio controls src={question.record} />
              </Box>
            )}

            {question.type === 'writing' ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Please write your answer:
                </Typography>
                <ReactQuill
                  value={answers[question.public_id]?.text || ''}
                  onChange={(content) => handleTextAnswerChange(question.public_id, content)}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      ['clean']
                    ],
                  }}
                  style={{ 
                    height: '300px',
                    marginBottom: '50px'
                  }}
                />
              </Box>
            ) : question.type === 'speaking' ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Please record your answer:
                </Typography>
                <AudioRecorder 
                  onRecordingComplete={(audioBlob, audioUrl) => handleAudioAnswerChange(question.public_id, audioBlob, audioUrl)} 
                />
                {answers[question.public_id]?.audioUrl && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Uploaded Audio URL:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ wordBreak: 'break-all', color: 'primary.main' }}
                      onClick={() => window.open(answers[question.public_id]?.audioUrl, '_blank')}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {answers[question.public_id]?.audioUrl}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Or enter audio URL manually:
                  </Typography>
                  <TextField
                    fullWidth
                    label="Audio URL"
                    variant="outlined"
                    size="small"
                    value={answers[question.public_id]?.audioUrl || ''}
                    onChange={(e) => handleManualAudioUrlChange(question.public_id, e.target.value)}
                  />
                </Box>
              </Box>
            ) : (
              <List>
                {question.Answers?.map((ans) => {
                  const selected = !!answers[question.public_id]?.includes(ans.public_id);
                  return (
                    <ListItem key={ans.public_id} disablePadding>
                      <FormControlLabel
                        control={
                          question.type === 'multiple_choice' ? (
                            <Checkbox
                              checked={selected}
                              onChange={() =>
                                handleSelectAnswer(question.public_id, ans.public_id, 'multiple_choice')
                              }
                            />
                          ) : (
                            <Radio
                              checked={selected}
                              onChange={() =>
                                handleSelectAnswer(question.public_id, ans.public_id, 'single_choice')
                              }
                            />
                          )
                        }
                        label={ans.content}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        );
        globalQuestionIndex++; // tăng sau mỗi question
        return rendered;
      })}

      {part.Children?.map((childPart, idx) =>
        renderPartRecursively(childPart, `${indexPath}.${idx + 1}`)
      )}
    </Box>
  );

  const filteredParts = displayParts;

  return (
    <Box p={4}>

      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {location.state?.selectedParts && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are practicing {location.state.selectedParts.length} part(s) with a total time of {totalDuration} minutes.
        </Alert>
      )}

      <ExamMenu
        parts={filteredParts}
        answers={answers}             // Object: { question_public_id: [answer_id1, answer_id2] }
        duration={totalDuration}
        onSubmit={handleSubmit}
      />

      <Stack spacing={2}>
        <Typography variant="h3" fontWeight={800} color="primary">{exam.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Duration: {totalDuration} minutes {location.state?.selectedParts ? '(Custom)' : `(Full Exam: ${exam.duration} minutes)`}
        </Typography>
        <Typography variant="body1" maxWidth={800}>{exam.description}</Typography>
      </Stack>

      {filteredParts.map((part, index) =>
        renderPartRecursively(part, `${index + 1}`)
      )}

    </Box>
  );
};

export default ExamStartPage;
