import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  CardMedia,
  Tooltip,
} from '@mui/material';
import GradientTitle from '../../../Components/GradientTitle';
import CircularLoading from '../../../Components/Loading';

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    try {
      const res = await axiosInstance.get(`/programs/status`);
      setPrograms(res.data);
    } catch (err) {
      console.error('Failed to fetch programs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const getChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="✅ Completed" color="success" size="small" />;
      case 'in_progress':
        return <Chip label="⏳ In Progress" color="warning" size="small" />;
      default:
        return <Chip label="📌 Not Started" variant="outlined" size="small" />;
    }
  };

  if (loading) return <CircularLoading />

  return (
    <Box sx={{ mt: 4 }}>
      <GradientTitle>Learning Programs</GradientTitle>

      <Typography align="center" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
        Browse through our carefully selected learning programs aimed at enhancing your English proficiency and boosting your confidence for success.
      </Typography>

      <Grid container spacing={4}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.public_id}>
            <Card
              component={Link}
              to={`/programs/${program.public_id}`}
              sx={{
                textDecoration: 'none',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {program.thumbnail && (
                <CardMedia
                  component="img"
                  height="160"
                  image={program.thumbnail}
                  alt={program.name}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Tooltip title={program.name} placement="top-start">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {program.name}
                  </Typography>
                </Tooltip>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {program.description}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {getChip(program.progressStatus)}
                  <Typography variant="caption">
                    {program.learnedLessons}/{program.totalLessons} {program.totalLessons > 1 ? 'lessons' : 'lesson'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {programs.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1">No learning programs available.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProgramPage;
