import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance"
import { Add } from '@mui/icons-material';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from "../../../Components/GradientTitle";

const CourseAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchCourses() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/courses/?page=${page}`);
        setCourses(response.data.courses); // Gán trực tiếp dữ liệu trả về từ API
        setPageCount(response.data.totalPages)
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses(); // Gọi hàm fetchCourses
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  const handleDelete = async (publicId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const response = await axiosInstance.delete(`/courses/${publicId}`);
      setCourses(courses.filter(course => course.public_id !== publicId));
    }
  };

  if (loading) return <CircularLoading />;
  
  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <GradientTitle align='left'>Courses Management</GradientTitle>
        <Button variant="contained" startIcon={<Add />} href="/admin/courses/create">
          Create Course
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={course.public_id}>
                <TableCell>{(page - 1) * 6 + index + 1}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>
                  <Button color="primary" component={Link} to={`/admin/courses/${course.public_id}`}>Detail</Button>
                  <Button color="error" onClick={() => handleDelete(course.public_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No courses found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {courses.length != 0 && <Pagination
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      />}
    </Container>
  );
};

export default CourseAdmin;
