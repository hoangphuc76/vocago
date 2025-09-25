import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  CheckCircleOutline,
  CancelOutlined,
  ExpandMore,
  Edit,
  Mic,
  VolumeUp,
  ThumbUp,
  ThumbDown,
  Lightbulb,
  Star
} from '@mui/icons-material';
import { green, red, blue, orange, purple, yellow } from '@mui/material/colors';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';

const ExamResultPage = () => {
  const { attemptPublicId } = useParams();
  const location = useLocation();
  const selectedAnswers = location.state?.selectedAnswers || [];

  const [result, setResult] = useState(null);
  const [userAnswersMap, setUserAnswersMap] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    axiosInstance
      .get(`/exams/attempts/result/${attemptPublicId}`)
      .then(res => {
        setResult(res.data);
        
        // Create a map of user answers for easy lookup
        const answersMap = {};
        if (res.data.userAnswers) {
          res.data.userAnswers.forEach(answer => {
            answersMap[answer.question_id] = answer;
          });
        }
        setUserAnswersMap(answersMap);
      })
      .catch(err => console.error('Error fetching result', err));
  }, [attemptPublicId]);

  if (!result) return <CircularLoading />;

  // Helper function to get user answer content from API response
  const getUserAnswerContent = (question) => {
    // For writing and speaking, we get the actual answer from API userAnswers
    const userAnswer = Object.values(userAnswersMap).find(answer => 
      answer.question_id === question.id
    );
    
    if (question.type === 'writing') {
      return userAnswer?.text_answer || 'No answer provided';
    } else if (question.type === 'speaking') {
      return userAnswer?.audio_record_url || 'No answer recorded';
    } else {
      // For regular questions, fallback to selectedAnswers from location.state
      const userData = selectedAnswers.find(s => s.question_public_id === question.public_id);
      return userData?.selected_answers?.join(', ') || 'N/A';
    }
  };

  // Helper function to get detailed feedback for writing/speaking questions
  const getDetailedFeedback = (question) => {
    // Get feedback from API userAnswers
    const userAnswer = Object.values(userAnswersMap).find(answer => 
      answer.question_id === question.id
    );
    
    return userAnswer || null;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  let questionCounter = 1;

  const renderFeedbackSection = (title, feedbackData, icon, color) => {
    if (!feedbackData) return null;
    
    return (
      <Box mt={2}>
        <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, color }}>
          {icon}
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          {feedbackData.summary}
        </Typography>
        
        {feedbackData.detailed_feedback && feedbackData.detailed_feedback.length > 0 && (
          <List dense>
            {feedbackData.detailed_feedback.map((item, idx) => (
              <ListItem key={idx} sx={{ pl: 0 }}>
                <ListItemText 
                  primary={item.explanation} 
                  secondary={
                    <Box component="span" sx={{ display: 'block', mt: 1 }}>
                      <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, fontStyle: 'italic' }}>
                        {item.good_sentence || item.problematic_sentence || item.suggested_fix}
                      </Box>
                      {item.original_sentence && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Original: {item.original_sentence}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    );
  };

  const renderPartRecursive = (part, partIndexPath = '') => {
    return (
      <Box key={part.public_id} mt={4}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}
          >
            <Typography variant="h6" fontWeight={700}>
              {partIndexPath} {part.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {part.Questions?.map((q) => {
              const userData = selectedAnswers.find(
                s => s.question_public_id === q.public_id
              );
              
              let isCorrect = false;
              let userAnswers = [];
              
              if (q.type === 'writing' || q.type === 'speaking') {
                // For writing/speaking, we don't calculate correctness in the same way
                userAnswers = [userData?.selected_answers?.[0] || 'No answer provided'];
                isCorrect = true; // We'll show Gemini feedback instead
              } else {
                // For regular questions
                userAnswers = userData?.selected_answers || [];
                const correctAnswers = (q.Answers || []).map(a => a.content);
                isCorrect =
                  userAnswers.length === correctAnswers.length &&
                  [...userAnswers].sort().join(',') ===
                  [...correctAnswers].sort().join(',');
              }

              const questionLabel = `Q${questionCounter++}`;
              
              // Get detailed feedback for writing/speaking questions
              const detailedFeedback = (q.type === 'writing' || q.type === 'speaking') 
                ? getDetailedFeedback(q) 
                : null;

              return (
                <Card 
                  key={q.public_id} 
                  sx={{ 
                    mb: 3, 
                    borderLeft: `6px solid ${isCorrect ? green[500] : red[500]}`,
                    boxShadow: 3
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight={600}>
                        {questionLabel}. {q.content}
                      </Typography>
                      <Chip 
                        label={q.type?.toUpperCase()} 
                        color={
                          q.type === 'writing' ? 'primary' : 
                          q.type === 'speaking' ? 'secondary' : 
                          q.type === 'listening' ? 'info' : 
                          'default'
                        } 
                        variant="outlined" 
                      />
                    </Box>

                    {q.thumbnail && (
                      <Box my={2} textAlign="center">
                        <img 
                          src={q.thumbnail} 
                          alt="Question illustration" 
                          style={{ maxWidth: '100%', borderRadius: '8px' }} 
                        />
                      </Box>
                    )}

                    {q.record && (
                      <Box my={2}>
                        <audio controls src={q.record} style={{ width: '100%' }} />
                      </Box>
                    )}

                    <Box mt={2}>
                      <Typography variant="subtitle1" fontWeight={600} color="primary">
                        Your Answer:
                      </Typography>
                      {q.type === 'writing' ? (
                        <Box sx={{ mt: 1, p: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                          <div dangerouslySetInnerHTML={{ 
                            __html: getUserAnswerContent(q) || 'No answer provided' 
                          }} />
                        </Box>
                      ) : q.type === 'speaking' ? (
                        <Box sx={{ mt: 1, p: 2, bgcolor: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <VolumeUp />
                          <Typography variant="body1">
                            {getUserAnswerContent(q) || 'No answer recorded'}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {getUserAnswerContent(q)}
                        </Typography>
                      )}
                    </Box>

                    {q.type !== 'writing' && q.type !== 'speaking' && (
                      <Box mt={2}>
                        <Typography variant="subtitle1" fontWeight={600} color="secondary">
                          Correct Answer:
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {(q.Answers || []).map(a => a.content).join(', ')}
                        </Typography>
                      </Box>
                    )}

                    {detailedFeedback && (
                      <Box mt={3} p={2} sx={{ bgcolor: '#e3f2fd', borderRadius: '8px' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                          <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange} 
                            variant="scrollable"
                            scrollButtons="auto"
                          >
                            <Tab label="Score" />
                            <Tab label="Strengths" />
                            <Tab label="Weaknesses" />
                            <Tab label="Suggestions" />
                          </Tabs>
                        </Box>
                        
                        <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: '4px' }}>
                          {activeTab === 0 && (
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={4}>
                                <Box textAlign="center" p={2}>
                                  <Typography variant="h3" color="primary" fontWeight={700}>
                                    {Number(detailedFeedback.score).toFixed(1)}/9
                                  </Typography>
                                  <Typography variant="subtitle1">Score</Typography>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={(detailedFeedback.score / 9) * 100} 
                                    sx={{ mt: 1, height: 10, borderRadius: 5 }} 
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <Typography variant="body1">
                                  This score reflects the overall quality of your response based on IELTS writing criteria including task achievement, coherence and cohesion, lexical resource, and grammatical range and accuracy.
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                          
                          {activeTab === 1 && renderFeedbackSection(
                            "Strengths", 
                            detailedFeedback.strengths, 
                            <ThumbUp sx={{ color: green[500] }} />, 
                            green[500]
                          )}
                          
                          {activeTab === 2 && renderFeedbackSection(
                            "Areas for Improvement", 
                            detailedFeedback.weaknesses, 
                            <ThumbDown sx={{ color: red[500] }} />, 
                            red[500]
                          )}
                          
                          {activeTab === 3 && renderFeedbackSection(
                            "Suggestions for Improvement", 
                            detailedFeedback.suggestions, 
                            <Lightbulb sx={{ color: yellow[800] }} />, 
                            yellow[800]
                          )}
                        </Box>
                      </Box>
                    )}

                    {q.type !== 'writing' && q.type !== 'speaking' && (
                      <Box mt={2} textAlign="right">
                        {isCorrect ? (
                          <Chip 
                            icon={<CheckCircleOutline />} 
                            label="Correct" 
                            color="success" 
                            variant="outlined" 
                          />
                        ) : (
                          <Chip 
                            icon={<CancelOutlined />} 
                            label="Incorrect" 
                            color="error" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {part.Children?.map((child, idx) =>
              renderPartRecursive(child, `${partIndexPath}${idx + 1}.`)
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h3" gutterBottom align="center" color="primary" fontWeight={800}>
          Exam Results
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight={700}>
                {Number(result.score).toFixed(1)}%
              </Typography>
              <Typography variant="subtitle1">Overall Score</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {result?.examAttemptDescription && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="h6" component="div">
                  {result.examAttemptDescription}
                </Typography>
              </Alert>
            )}
            <Typography variant="h6" align="center">
              Time Taken: {result.attemptDuration} minutes
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box mt={4}>
        {result.parts.map((part, idx) =>
          renderPartRecursive(part, `${idx + 1}.`)
        )}
      </Box>
    </Box>
  );
};

export default ExamResultPage;
