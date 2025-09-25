import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box
} from "@mui/material";
import { Group, MenuBook, HowToReg, Apps, Assignment, DoneAll } from "@mui/icons-material";
import axiosInstance from "../../Api/axiosInstance";
import GradientTitle from "../../Components/GradientTitle";
import StripeChart from "../../Components/admin/StripeChart";

const statsConfig = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: <Group fontSize="large" />,
    color: ["#42a5f5", "#478ed1"]
  },
  {
    key: "totalCourses",
    label: "Total Courses",
    icon: <MenuBook fontSize="large" />,
    color: ["#66bb6a", "#43a047"]
  },
  {
    key: "totalEnrollments",
    label: "Total Enrollments",
    icon: <HowToReg fontSize="large" />,
    color: ["#ffa726", "#fb8c00"]
  },
  {
    key: "totalPrograms",
    label: "Total Programs",
    icon: <Apps fontSize="large" />,
    color: ["#ab47bc", "#8e24aa"]
  },
  {
    key: "totalExams",
    label: "Total Exams",
    icon: <Assignment fontSize="large" />,
    color: ["#ec407a", "#d81b60"]
  },
  {
    key: "totalExamAttempts",
    label: "Total Exam Attempts",
    icon: <DoneAll fontSize="large" />,
    color: ["#ff7043", "#f4511e"]
  }
];

const AdminHome = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/user-course/statistics");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box p={4}>
      <GradientTitle align='left'>Admin Dashboard</GradientTitle>

      <Grid container spacing={3}>
        {statsConfig.map(({ key, label, icon, color }) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
                color: "white",
                borderRadius: 3,
                boxShadow: 6,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 10
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  {icon}
                  <Box>
                    <Typography variant="body1">{label}</Typography>
                    <Typography variant="h4">
                      {stats[key] !== undefined ? stats[key] : "..."}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={5}>
        <StripeChart />
      </Box>
    </Box>
  );
};

export default AdminHome;
