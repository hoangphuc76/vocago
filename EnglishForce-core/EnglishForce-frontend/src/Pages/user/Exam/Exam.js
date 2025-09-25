import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QuizIcon from '@mui/icons-material/Quiz';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

const ExamPage = () => {
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // input chưa debounce
  const [category, setCategory] = useState(''); // all categories by default

  const debounceRef = useRef();

  const fetchExams = async (page, searchQuery = '', categoryFilter = '') => {
    try {
      setLoading(true);
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      if (searchQuery) params.append('q', searchQuery);
      if (categoryFilter) params.append('type', categoryFilter);
      
      const res = await axiosInstance.get(`/exams?${params.toString()}`);
      setExams(res.data.exams);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Gọi API khi query hoặc category thực sự thay đổi (đã debounce)
    fetchExams(page, query, category);
  }, [page, query, category]);

  useEffect(() => {
    // Debounce sau 500ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);      // reset page
      setQuery(searchInput); // update query chính thức
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const handleCategoryChange = (event, newCategory) => {
    setPage(1); // Reset to first page
    setCategory(newCategory || ''); // '' for 'All' category
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 6 }, minHeight: '100vh' }}>
      <GradientTitle>Available Exams</GradientTitle>

      <Typography align="center" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
        Explore our curated list of mock exams designed to help you sharpen your English skills and prepare with confidence.
      </Typography>

      {/* Category Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          aria-label="exam category"
          size="small"
        >
          <ToggleButton value="" aria-label="all exams">
            All
          </ToggleButton>
          <ToggleButton value="toeic" aria-label="toeic exams">
            TOEIC
          </ToggleButton>
          <ToggleButton value="ielts" aria-label="ielts exams">
            IELTS
          </ToggleButton>
          <ToggleButton value="toefl" aria-label="toefl exams">
            TOEFL
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 🔍 Thanh Tìm kiếm */}
      <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search exam..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Chỉ hiển thị loading lúc đầu */}
      {loading ? (
        <CircularLoading />
      ) : (
        <Grid container spacing={4}>
          {exams.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                {category || query 
                  ? `No ${category ? category.toUpperCase() : ''} exams found${query ? ` matching "${query}"` : ''}.` 
                  : 'No exams available.'}
              </Typography>
            </Grid>
          ) : (
            exams.map((exam) => (
              <Grid key={exam.public_id} item xs={12} sm={6} md={4}>
                <Card
                  elevation={6}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 10px 30px rgba(25, 118, 210, 0.15)',
                    },
                  }}
                >
                  <CardActionArea component={Link} to={`/exams/${exam.public_id}`} sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <QuizIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                          {exam.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {exam.description || 'No description provided.'}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                        <Chip label={exam.type.toUpperCase()} size="small" color={
                          exam.type === 'toeic' ? 'primary' : 
                          exam.type === 'ielts' ? 'secondary' : 
                          exam.type === 'toefl' ? 'info' : 'default'
                        } />
                        <Chip label={`${exam.duration} minutes`} size="small" variant="outlined" />
                      </Stack>
                      <Chip label="Start Exam" color="primary" variant="outlined" />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {totalPages > 1 && !loading && (
        <Stack alignItems="center" mt={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
};

export default ExamPage;
