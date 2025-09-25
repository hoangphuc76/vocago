import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import axiosInstance from '../../Api/axiosInstance';
import CircularLoading from '../../Components/Loading';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/auth/change-password`, {
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error when changing password. Current password is incorrect.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Current Password"
        type="password"
        fullWidth
        required
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        label="New Password"
        type="password"
        fullWidth
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        label="Confirm New Password"
        type="password"
        fullWidth
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ mt: 1 }}
      />
      <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
        {loading ? 'Processing...' : 'Change Password'}
      </Button>
      {message && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </form>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  if (loading) return <CircularLoading />;
  if (!user) return <Typography variant="h6">No user data available</Typography>;

  const stats = user.stats || {};
  const data = [
    { name: 'Completed Program Lessons', value: stats.programsCount || 0 },
    { name: 'Exam Attempts', value: stats.examAttemptsCount || 0 },
    { name: 'Courses Purchased', value: stats.coursesCount || 0 },
  ];

  const programScore = typeof stats.averageScoreProgram === 'number'
    ? (stats.averageScoreProgram * 100).toFixed(2)
    : '0.00';
  const examScore = typeof stats.averageScoreExam === 'number'
    ? stats.averageScoreExam.toFixed(2)
    : '0.00';

  return (
    <Container>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Typography variant="h6">Username: {user.username}</Typography>
        <Typography variant="h6">Role: {user.role}</Typography>

        <Button variant="contained" onClick={handleDialogOpen} sx={{ mt: 3 }}>
          Change Password
        </Button>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Your General Learning Statistics
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={['#1976d2', '#e53935', '#fbc02d'][index % 3]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Average Scores
        </Typography>
        <Typography variant="body1">Program Average Score: <strong>{programScore}%</strong></Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>Exam Average Score: <strong>{examScore}%</strong></Typography>

        {Array.isArray(stats.examScoresOverTime) && stats.examScoresOverTime.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Exam Score Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.examScoresOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="created_at"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip labelFormatter={(date) => new Date(date).toLocaleString()} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <ChangePassword />
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Profile;
