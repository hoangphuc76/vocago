import { Typography, Container, Box, Paper, Grid, Stack, Divider, Button } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import GradientTitle from "../GradientTitle";

import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#ffffff',
                py: { xs: 10, md: 14 },
                position: 'relative',
                zIndex: 1,
            }}
        >
            {/* Glow Gradient Background Blob */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 250,
                    height: 250,
                    background: 'radial-gradient(circle, rgba(25,118,210,0.15), transparent)',
                    borderRadius: '50%',
                    top: 0,
                    left: -80,
                    zIndex: 0,
                    filter: 'blur(60px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: 250,
                    height: 250,
                    background: 'radial-gradient(circle, rgba(126,87,194,0.15), transparent)',
                    borderRadius: '50%',
                    bottom: 0,
                    right: -80,
                    zIndex: 0,
                    filter: 'blur(60px)',
                }}
            />

            <Container sx={{ position: 'relative', zIndex: 1 }}>
                <Stack
                    direction={{ xs: 'column-reverse', md: 'row' }}
                    spacing={6}
                    alignItems="center"
                >
                    {/* Image section */}
                    <Box flex={1} display="flex" justifyContent="center">
                        <Box
                            component="img"
                            src="english.jpg"
                            alt="Learning English"
                            sx={{
                                width: '100%',
                                maxWidth: 420,
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(25, 118, 210, 0.2)',
                                transition: 'transform 0.4s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                },
                            }}
                        />
                    </Box>

                    {/* Text section */}
                    <Box flex={1}>
                        <Typography
                            variant="h3"
                            fontWeight={800}
                            sx={{
                                mb: 2,
                                background: 'linear-gradient(to right, #1976d2, #7e57c2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Learn Anytime, Anywhere
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: 520,
                                mb: 4,
                            }}
                        >
                            Unlock your potential with personalized English learning powered by smart algorithms,
                            interactive courses, and real-world simulations. Study from anywhere, anytime.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                component={Link}
                                to="/courses"
                                size="large"
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    background: 'linear-gradient(to right, #1976d2, #00c6ff)',
                                    color: 'white',
                                    boxShadow: '0 0 15px rgba(25, 118, 210, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(to right, #1565c0, #00bcd4)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Explore Courses
                            </Button>
                            <Button
                                component={Link}
                                to="/exams"
                                size="large"
                                variant="outlined"
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    fontWeight: 700,
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                        borderColor: '#1565c0',
                                    },
                                }}
                            >
                                Simulate Exam
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};


const features = [
    {
        icon: <PsychologyAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: 'AI-Powered Learning',
        description: 'Smart chatbot and personalized recommendations based on your progress.'
    },
    {
        icon: <AutoStoriesIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
        title: 'Free English Program',
        description: 'A structured program to improve all 4 skills: listening, speaking, reading, and writing.'
    },
    {
        icon: <QuizIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
        title: 'Exam Simulations',
        description: 'Practice with mock tests that mimic actual TOEIC exams.'
    },
    {
        icon: <SchoolIcon sx={{ fontSize: 40, color: 'success.main' }} />,
        title: 'Video-based Courses',
        description: 'Learn with engaging videos. No quizzes – just watch and absorb knowledge!'
    },
];

const WhyUsSection = () => {
    return (
        <Box sx={{ backgroundColor: "#ffffff", py: 10 }}>
            <Container maxWidth="lg">
                <GradientTitle>Why Choose EnglishForce?</GradientTitle>
                <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
                >
                    We blend smart technology and proven methods to deliver an online learning experience that feels personal, structured, and effective.
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid key={index} item xs={12} sm={6} md={3}>
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    background: '#ffffff',
                                    borderRadius: 3,
                                    border: '2px solid transparent',
                                    backgroundImage: `linear-gradient(#ffffff, #ffffff), 
                                    linear-gradient(135deg, #1976d2, #7e57c2)`,
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'padding-box, border-box',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    textAlign: 'center',
                                    color: '#1e1e2f',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px) scale(1.02)',
                                        boxShadow: '0 0 20px rgba(25, 118, 210, 0.2)',
                                    },
                                }}
                            >
                                <Box>{feature.icon}</Box>
                                <Typography variant="h6" fontWeight={700} sx={{ my: 2 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};



const TestimonialCard = ({ name, feedback }) => (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 300 }}>
        <FormatQuoteIcon color="disabled" />
        <Typography variant="body1" gutterBottom>"{feedback}"</Typography>
        <Typography variant="subtitle2" color="primary">— {name}</Typography>
    </Paper>
);


export const HomeFeatures = () => {
    return (<>
        <HeroSection />
        {/* Why Us */}
        <WhyUsSection />

        {/* Testimonials */}
        {/* <Box sx={{ py: 6 }}>
            <Container>
                <Typography variant="h4" gutterBottom>What Our Students Say</Typography>
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={4} mt={4}>
                    <TestimonialCard
                        name="Minh T."
                        feedback="I improved my IELTS score by 1.5 bands in just 2 months with this platform!"
                    />
                    <TestimonialCard
                        name="Ngoc Anh"
                        feedback="The exam system feels just like real TOEIC practice. Love it!"
                    />
                    <TestimonialCard
                        name="Thanh"
                        feedback="The video + audio content makes learning super engaging. Highly recommend!"
                    />
                </Box>
            </Container>
        </Box> */}
    </>)
}