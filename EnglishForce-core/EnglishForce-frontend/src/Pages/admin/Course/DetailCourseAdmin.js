import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";
import CircularLoading from '../../../Components/Loading';

const DetailCourseAdmin = () => {
  const { publicId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axiosInstance.get(`/courses/${publicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Giả sử API trả về đối tượng course bao gồm cả mảng sections
        setCourse(response.data);
        const response2 = await axiosInstance.get(`/course_sections/course/${publicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSections(response2.data)
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Error fetching course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [publicId]);

  const handleDelete = async (publicId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const response = await axiosInstance.delete(`/courses/${publicId}`);
      window.location.href = `/admin/courses`;
    }
  };
  
  if (loading) return <CircularLoading />;

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Course not found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Course Details</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Course Name: {course.name}</Typography>
        <Typography variant="body1">Instructor: {course.instructor}</Typography>
        <Typography variant="body1">Price: {course.price}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {course.description}
        </Typography>
        {/* Hiển thị ảnh thumbnail nếu có */}
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            style={{ maxWidth: "100%", maxHeight: "300px", marginTop: 10 }}
          />
        )}
      </Paper>

      <Typography variant="h5" gutterBottom>Course Sections</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Index</TableCell>
              <TableCell>Section Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Video Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.public_id}>
                <TableCell>{section.order_index}</TableCell>
                <TableCell>{section.name}</TableCell>
                <TableCell>{section.description}</TableCell>
                <TableCell>
                  {section.video_link ? (
                    <a href={section.video_link} target="_blank" rel="noopener noreferrer">
                      View Video
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mr: 2 }}
        component={Link}
        to={`/admin/courses/edit/${publicId}`}
      >
        Edit Course
      </Button>
      <Button
        variant="contained"
        color="info"
        sx={{ mt: 2, mr: 2 }}
        component={Link}
        to={`/admin/courses/sections/${publicId}`}
      >
        Edit Course Sections
      </Button>
      <Button variant="contained" color="error" sx={{ mt: 2 }}
      onClick={()=>handleDelete(publicId)} >
        Delete Course
      </Button>
    </Container>
  );
};

export default DetailCourseAdmin;
