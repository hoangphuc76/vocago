// Detail exam : Infor of 1 exam , Part list

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent,
  Accordion, AccordionSummary, AccordionDetails,
  Box, CircularProgress, Button, Divider, Chip,
} from '@mui/material';
import CircularLoading from '../../../Components/Loading';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../../Api/axiosInstance';
import { useParams, Link } from 'react-router-dom';

const DetailExamAdmin = () => {
  const { publicId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const res = await axiosInstance.get(`/exams/${publicId}`);
        setExam(res.data);
      } catch (err) {
        console.error('Error fetching exam:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [publicId]);

  const renderQuestions = (questions) => (
    <Box sx={{ mt: 1 }}>
      {questions.map((q, qIdx) => (
        <Box key={q.id} sx={{ mb: 3 }}>
          <Typography sx={{ mb: 1 }}>
            {qIdx + 1}. {q.content} ({q.type})
          </Typography>
          {q.thumbnail && (
            <img
              src={q.thumbnail}
              alt="thumb"
              style={{ width: 80, marginTop: 4, borderRadius: 4 }}
            />
          )}
          {q.record && (
            <audio controls style={{ marginTop: 8 }}>
              <source src={q.record} type="audio/mpeg" />
            </audio>
          )}
          <Box sx={{ mt: 1, pl: 2 }}>
            {q.Answers?.map((ans) => (
              <Typography
                key={ans.id}
                variant="body2"
                sx={{ color: ans.is_correct ? 'green' : 'text.primary' }}
              >
                - {ans.content} {ans.is_correct && '(Correct)'}
              </Typography>
            ))}
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );

  const renderPartRecursive = (part) => (
    <Accordion key={part.id} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{part.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {part.description && (
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            {part.description}
          </Typography>
        )}

        {/* Questions in this part */}
        {part.Questions && part.Questions.length > 0 && renderQuestions(part.Questions)}

        {/* Children parts */}
        {part.Children && part.Children.length > 0 && (
          <Box sx={{ mt: 2, ml: 2 }}>
            {part.Children.map((child) => renderPartRecursive(child))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  if (loading) return <CircularLoading />;

  if (!exam) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h6" color="error">
          Exam not found or no data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Exam Detail</Typography>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">{exam.name}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Duration: {exam.duration} minutes
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            {exam.description}
          </Typography>

          <Box mt={2}>
            <Chip
              label={exam.type === 'toeic' ? 'TOEIC' : 'General'}
              color={exam.type === 'toeic' ? 'primary' : 'default'}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>


      <Typography variant="h5" gutterBottom>Exam Parts</Typography>

      {exam.parts.map(part => renderPartRecursive(part))}

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          component={Link}
          to={`/admin/exams/edit/${publicId}`}
        >
          Edit Exam
        </Button>
        <Button
          variant="contained"
          color="info"
          sx={{ mr: 2 }}
          component={Link}
          to={`/admin/exams/${publicId}/parts`}
        >
          Edit Exam Parts
        </Button>
        <Button
          variant="contained"
          color="error"
        // onClick={() => handleDelete(publicId)}
        >
          Delete Exam
        </Button>
      </Box>
    </Container>
  );
};

export default DetailExamAdmin;
