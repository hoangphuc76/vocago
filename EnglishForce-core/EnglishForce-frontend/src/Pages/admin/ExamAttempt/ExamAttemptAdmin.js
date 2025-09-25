import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

const ExamAttemptAdmin = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAttempts(page);
  }, [page]);

  const fetchAttempts = async (page) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/exam-attempts?page=${page}`);
      setAttempts(res.data.attempts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch exam attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <GradientTitle align='left'>Exam Attempts Management</GradientTitle>

      {loading ? (
        <CircularLoading />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Exam</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attempts.map((a, i) => (
                  <TableRow key={a.id}>
                    <TableCell>{(page - 1) * 6 + i + 1}</TableCell>
                    <TableCell>{a.User?.username || 'N/A'}</TableCell>
                    <TableCell>{a.Exam?.name || 'N/A'}</TableCell>
                    <TableCell>{a.score} / 100</TableCell>
                    <TableCell>{new Date(a.start).toLocaleString()}</TableCell>
                    <TableCell>{new Date(a.end).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {attempts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No attempts found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {attempts.length>0 && <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            color="primary"
          />}
        </>
      )}
    </Container>
  );
};

export default ExamAttemptAdmin;
