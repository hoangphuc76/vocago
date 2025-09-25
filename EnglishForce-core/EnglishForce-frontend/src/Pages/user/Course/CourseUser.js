import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance"
import CourseImage from "../../../Components/user/CourseImage";
import { CartContext } from "../../../Context/CartContext";
import CircularLoading from "../../../Components/Loading";
import GradientTitle from "../../../Components/GradientTitle";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/user-course/user");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <CircularLoading />;

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (courses.length === 0) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <GradientTitle>You have not enrolled in any courses yet.</GradientTitle>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <GradientTitle>My learning</GradientTitle>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.public_id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >

              <CourseImage course={course} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{course.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  by {course.author}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    height: '60px', // Chiều cao cố định
                    overflow: 'hidden', // Ẩn phần nội dung vượt quá
                    textOverflow: 'ellipsis', // Thêm dấu "..." khi nội dung quá dài
                    display: '-webkit-box',
                    WebkitLineClamp: 3, // Giới hạn số dòng hiển thị
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {course.description}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: "auto" }}
                component={Link}
                to={`/courses/${course.public_id}`}
              >
                Learn Now
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CoursesPage;
