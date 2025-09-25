import React, { useEffect, useState } from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import axiosInstance from "../../Api/axiosInstance";
import CourseCard from "../../Components/user/CourseCard";
import { HomeFeatures } from "../../Components/user/HomeFeatures";
import Slider from "react-slick"; // Import Carousel
import { Link } from 'react-router-dom';

// Import CSS cho carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Height } from "@mui/icons-material";
import GradientTitle from "../../Components/GradientTitle";

const testimonials = [
  {
    name: "Anna Nguyen",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    feedback: "This platform has truly transformed the way I learn English. Highly recommended!",
  },
  {
    name: "John Tran",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    feedback: "The interactive lessons and engaging content keep me motivated every day!",
  },
  {
    name: "Lisa Pham",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    feedback: "Excellent platform! The course structure is well organized and easy to follow.",
  }
];


const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axiosInstance.get("/courses/top-rated");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  // Cấu hình cho carousel
  const sliderSettings = {
    dots: true,
    infinite: courses.length > 2,
    speed: 500,
    slidesToShow: 3,  // Hiển thị 3 khóa học cùng lúc
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // Khi màn hình nhỏ hơn 1024px, hiển thị 2 card
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // Khi màn hình nhỏ hơn 600px, hiển thị 1 card
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <Box
        sx={{
          height: '90vh',  // full viewport height
          width: '100%',
          position: 'relative',
          // backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')`,
          // backgroundImage: `url('https://t3.ftcdn.net/jpg/03/91/46/10/360_F_391461057_5P0BOWl4lY442Zoo9rzEeJU0S2c1WDZR.jpg')`,
          backgroundImage: `url('background.jpg')`,
          // backgroundImage: `url('https://i.pinimg.com/736x/ab/68/f6/ab68f66366b2582b000aedd27f20ed70.jpg')`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {/* Overlay đen mờ */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        />

        {/* Nội dung hero */}
        <Container
          maxWidth="md"
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            px: 3,
          }}
        >
          <RocketLaunchIcon sx={{ fontSize: 60, color: "#90caf9", mb: 2 }} />
          <Typography variant="h2" fontWeight={800} gutterBottom sx={{ textShadow: "0 0 10px #1976d2" }}>
            Welcome to Vocago
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 700, margin: "auto" }}>
            Your ultimate platform for effective and fun English learning.
          </Typography>
          <Button
            component={Link}
            to="/programs"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              mt: 1,
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(to right, #1976d2, #64b5f6)",
              boxShadow: "0 0 15px #1976d2",
              "&:hover": {
                background: "linear-gradient(to right, #1565c0, #2196f3)",
              },
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>


      <HomeFeatures />

      {/* Courses Carousel Section */}
      <Container sx={{ py: 6 }}>
        <GradientTitle>Popular Courses</GradientTitle>
        {courses.length > 0 ? (
          <Slider {...sliderSettings}>
            {courses.map((course, index) => (
              <Box key={index} sx={{ px: 2 }}>
                <CourseCard course={course} sx={{ minHeight: "50%vp" }} />
              </Box>
            ))}
          </Slider>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No courses available at the moment.
          </Typography>
        )}
      </Container>

      <Container sx={{ py: 6 }}>
        <GradientTitle>What Our Learners Say</GradientTitle>
        <Slider {...sliderSettings}>
          {testimonials.map((t, idx) => (
            <Box key={idx} sx={{ px: 2, height: 250 }}>
              <Box
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  bgcolor: 'background.paper'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                  "{t.feedback}"
                </Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                  — {t.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Container>

    </>
  );
};

export default HomePage;
