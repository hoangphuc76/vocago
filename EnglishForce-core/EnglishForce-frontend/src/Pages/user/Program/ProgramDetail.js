import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Avatar,
  Fade,
  Tooltip
} from '@mui/material';
import CircularLoading from '../../../Components/Loading';
import SchoolIcon from '@mui/icons-material/School';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import StarIcon from '@mui/icons-material/Star';

const ProgramDetailPage = () => {
  const { programPublicId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgramDetail = async () => {
    try {
      const res = await axiosInstance.get(`/programs/${programPublicId}/progress`);
      setProgram(res.data);
      setUnits(res.data.Units || []);
    } catch (error) {
      console.error('❌ Failed to fetch program detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramDetail();
  }, [programPublicId]);

  if (loading) return <CircularLoading />;

  if (!program) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={4}>
        Program not found
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Fade in timeout={600}>
        <Box>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              background: 'linear-gradient(to right, #1976d2, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            {program.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            {program.description}
          </Typography>
        </Box>
      </Fade>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" fontWeight={700} gutterBottom>
        📘 Units
      </Typography>

      <Grid container spacing={3}>
        {units.map((unit) => (
          <Grid item xs={12} md={6} key={unit.public_id}>
            <Card
              onClick={() => navigate(`/units/${unit.public_id}`)}
              sx={{
                cursor: 'pointer',
                borderRadius: 3,
                height: '100%',
                background: 'linear-gradient(135deg, #f3f4f6, #e0f7fa)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                    <Tooltip title="Unit Icon">
                      <SchoolIcon />
                    </Tooltip>
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {unit.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {unit.description || 'No description'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {unit.progressStatus && (
                  <Chip
                    icon={
                      unit.progressStatus === 'completed' ? <StarIcon /> :
                      unit.progressStatus === 'in_progress' ? <EmojiObjectsIcon /> : undefined
                    }
                    label={
                      unit.progressStatus === 'completed'
                        ? '✅ Completed'
                        : unit.progressStatus === 'in_progress'
                        ? '⏳ In progress'
                        : '📌 Not started'
                    }
                    color={
                      unit.progressStatus === 'completed'
                        ? 'success'
                        : unit.progressStatus === 'in_progress'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        {units.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" mt={2}>
              ⚠️ There are no units in this program yet.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProgramDetailPage;
