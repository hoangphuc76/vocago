import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Fade,
  Stack,
  Avatar,
  Paper
} from '@mui/material';
import CircularLoading from '../../../Components/Loading';
import SchoolIcon from '@mui/icons-material/School';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const UnitDetailPage = () => {
  const { unitPublicId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUnitDetail = async () => {
    try {
      const res = await axiosInstance.get(`/units/${unitPublicId}`);
      setUnit(res.data);
    } catch (err) {
      console.error("Error loading unit:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitDetail();
  }, [unitPublicId]);

  if (loading) return <CircularLoading />;

  if (!unit) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={4}>
        Unit not found
      </Typography>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box p={3}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(to right, #e3f2fd, #fce4ec)' }}>
          <Typography variant="h3"  gutterBottom textAlign="center" sx={{
            background: 'linear-gradient(to right, #1976d2, #d81b60)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {unit.name}
          </Typography>

          <Typography variant="subtitle1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
            {unit.description}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight={700} gutterBottom>
            🧩 Lessons Included
          </Typography>

          {unit.Lessons && unit.Lessons.length > 0 ? (
            <List>
              {unit.Lessons.sort((a, b) => a.order_index - b.order_index).map((lesson, idx) => (
                <React.Fragment key={lesson.public_id}>
                  <ListItem
                    component={Link}
                    to={`/units/${unitPublicId}/lessons/${lesson.public_id}/start`}
                    button
                    sx={{
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2,
                      my: 1,
                      transition: '0.2s',
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                      <SchoolIcon />
                    </Avatar>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{`${lesson.order_index + 1}. ${lesson.name}`}</Typography>}
                      secondary={lesson.description}
                    />
                    {lesson.UserProgresses?.length > 0 && (
                      <Chip
                        icon={<DoneAllIcon />}
                        label="Completed"
                        color="success"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              There are no lessons in this unit.
            </Typography>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default UnitDetailPage;
