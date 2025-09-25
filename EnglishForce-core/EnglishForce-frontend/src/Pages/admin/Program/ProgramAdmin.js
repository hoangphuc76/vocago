import React, { useEffect, useState } from 'react';
import {
  Box, Container, Button, Typography, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../../../Api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import GradientTitle from '../../../Components/GradientTitle';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  const fetchPrograms = async () => {
    try {
      const res = await axiosInstance.get('/programs'); 
      setPrograms(res.data.programs);
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    }
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await axiosInstance.delete(`/programs/${publicId}`);
      fetchPrograms(); // reload
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <GradientTitle align='left'>Learning Programs Management</GradientTitle>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/admin/programs/create')}>
          Add Program
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Thumbnail</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program, index) => (
              <TableRow key={program.public_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.description}</TableCell>
                <TableCell>{program.order_index}</TableCell>
                <TableCell>
                  {program.thumbnail ? (
                    <img src={program.thumbnail} alt="thumbnail" width={60} />
                  ) : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  <Button color="primary" component={Link} to={`/admin/programs/${program.public_id}`}>Detail</Button>
                  <Button color="error" onClick={() => handleDelete(program.public_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {programs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No programs found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProgramList;
