import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Paper, Button, Dialog, DialogContent, DialogTitle, TextField, Grid, Box, Card, CardContent, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

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
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mt: 1 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 1 }}>
          {loading ? 'Processing...' : 'Change Password'}
        </Button>
      </form>
      {message && <Typography variant="body1">{message}</Typography>}
    </div>
  );
};



const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // For controlling Dialog visibility
  const defaultAvatar = '/2.png';

  useEffect(() => {
    async function Fetch() {
      try {
        const response = await axiosInstance.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Có thể hiển thị message lỗi hoặc set trạng thái lỗi
      } finally {
        setLoading(false);
      }
    }
    Fetch();
  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return <CircularLoading />;
  }
  const data = [
    { name: 'Completed Program Lessons', value: user.stats?.programsCount || 0 },
    { name: 'Exam Attempts', value: user.stats?.examAttemptsCount || 0 },
    { name: 'Courses Purchased', value: user.stats?.coursesCount || 0 }
  ];

  return (
    <Container>
      {user ? (
        <Paper style={{ padding: '20px' }}>
          <GradientTitle align="left">Profile</GradientTitle>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    src={user.avatar || defaultAvatar}
                    alt="User Avatar"
                    sx={{ width: 100, height: 100 }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" gutterBottom>
                    Username: <strong>{user.username}</strong>
                  </Typography>
                  <Typography variant="h6">
                    Role: <strong>{user.role}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ mt: 3 }}>
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

          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            Average Scores
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Program Average Score: <strong>{user.stats?.averageScoreProgram * 100 || 0}%</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Exam Average Score: <strong>{user.stats?.averageScoreExam || 0}%</strong>
          </Typography>

          {user.stats?.examScoresOverTime?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Exam Score Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={user.stats.examScoresOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="created_at"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleString()}
                  />
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


          {/* Dialog for Change Password */}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <ChangePassword />
            </DialogContent>
          </Dialog>
        </Paper>
      ) : (
        <Typography variant="h6">No user data available</Typography>
      )}
    </Container>
  );
};

export default Profile;
