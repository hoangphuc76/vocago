import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../../Api/axiosInstance";
import CourseCard from "../../../Components/user/CourseCard";
import GradientTitle from "../../../Components/GradientTitle";
import CircularLoading from "../../../Components/Loading";
import RecommendedCourses from "../../../Components/user/RecommendedCourses";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  // Search states for each tab
  const [searchInputGeneral, setSearchInputGeneral] = useState("");
  const [queryGeneral, setQueryGeneral] = useState("");
  const [searchInputRecommended, setSearchInputRecommended] = useState("");
  const [queryRecommended, setQueryRecommended] = useState("");

  const debounceRefGeneral = useRef();
  const debounceRefRecommended = useRef();

  const fetchCourses = async (page, searchQuery = "") => {
    try {
      setLoading(true);
      let url = `/courses?page=${page}`;
      if (searchQuery) url += `&q=${searchQuery}`;

      const res = await axiosInstance.get(url);
      setCourses(res.data.courses);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabValue === 0) fetchCourses(page, queryGeneral);
  }, [page, queryGeneral, tabValue]);

  useEffect(() => {
    clearTimeout(debounceRefGeneral.current);
    debounceRefGeneral.current = setTimeout(() => {
      setPage(1);
      setQueryGeneral(searchInputGeneral);
    }, 500);
    return () => clearTimeout(debounceRefGeneral.current);
  }, [searchInputGeneral]);

  useEffect(() => {
    clearTimeout(debounceRefRecommended.current);
    debounceRefRecommended.current = setTimeout(() => {
      setQueryRecommended(searchInputRecommended);
    }, 500);
    return () => clearTimeout(debounceRefRecommended.current);
  }, [searchInputRecommended]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );

  const currentSearchInput = tabValue === 0 ? searchInputGeneral : searchInputRecommended;
  const setCurrentSearchInput = tabValue === 0 ? setSearchInputGeneral : setSearchInputRecommended;

  return (
    <Container sx={{ mt: 4 }}>
      <GradientTitle>Available Courses</GradientTitle>

      <Typography align="center" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 2 }}>
        Browse our collection of English courses crafted to help you grow confidently.
      </Typography>

      <Box sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search course..."
          value={currentSearchInput}
          onChange={(e) => setCurrentSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }} >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="General" value={0} />
          <Tab label="For you" value={1} />
        </Tabs>
      </Box>

      {loading ? <CircularLoading /> :
        tabValue === 0 ? (
          <>
            <Grid container spacing={3}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>

            {courses.length !== 0 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ display: "flex", justifyContent: "center", mt: 4 }}
              />
            )}
          </>
        ) : (
          <RecommendedCourses active={tabValue === 1} query={queryRecommended} />
        )
      }
    </Container>
  );
};

export default CoursesPage;
