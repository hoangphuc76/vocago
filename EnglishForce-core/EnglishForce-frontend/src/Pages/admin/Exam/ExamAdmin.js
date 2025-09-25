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
  IconButton,
  Button,
  Stack,
  Pagination
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axiosInstance from '../../../Api/axiosInstance';
import { Link } from "react-router-dom";
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

const ExamAdmin = () => {
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams(page);
  }, [page]);

  const fetchExams = async (page) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/exams?page=${page}`);
      setExams(res.data.exams);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }

  };

  const handleDelete = async (publicId) => {
    try {
      await axiosInstance.delete(`/exams/${publicId}`);
      setExams(prev => prev.filter((exam) => exam.public_id !== publicId));
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };


  if (loading) return <CircularLoading />;

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <GradientTitle>Exam Management</GradientTitle>
        <Button variant="contained" startIcon={<Add />} href="/admin/exams/create">
          Create Exam
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Exam Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam, index) => (
              <TableRow key={exam.public_id}>
                <TableCell>{(page - 1) * 6 + index + 1}</TableCell>
                <TableCell>{exam.name}</TableCell>
                <TableCell>{exam.description}</TableCell>
                <TableCell>{exam.duration}</TableCell>
                <TableCell>
                  <Button color="primary" component={Link} to={`/admin/exams/${exam.public_id}`}>Detail</Button>
                  <Button color="error" onClick={() => handleDelete(exam.public_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {exams.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No exams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Stack alignItems="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </Container>
  );
};

export default ExamAdmin;
