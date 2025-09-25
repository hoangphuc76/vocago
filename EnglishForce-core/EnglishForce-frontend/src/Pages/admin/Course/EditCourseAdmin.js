import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Input,
  Snackbar, Alert,
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";

const EditCourse = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    name: "",
    instructor: "",
    description: "",
    price: null,
    thumbnail: ""
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailMode, setThumbnailMode] = useState("link");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${publicId}`);
        const data = response.data;
        setCourseData({
          name: data.name || "",
          instructor: data.instructor || "",
          description: data.description || "",
          price: data.price || 0,
          thumbnail: data.thumbnail || ""
        });
        if (data.thumbnail) setImagePreview(data.thumbnail);
        setThumbnailMode(data.thumbnail ? "link" : "upload");
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [publicId]);

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const checkPrice = (price) => {
    const numericPrice = parseFloat(price);
    return numericPrice === 0 || numericPrice >= 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkPrice(courseData.price)) {
      setError("Price must be 0 (free) or greater than or equal to 1$.");
      setSnackbarMessage("Invalid price value.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", courseData.name);
      formData.append("instructor", courseData.instructor);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price);

      if (thumbnailMode === "link" && courseData.thumbnail) {
        formData.append("thumbnail", courseData.thumbnail);
      }

      if (thumbnailMode === "upload" && thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await axiosInstance.put(`/courses/${publicId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbarMessage("Course updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate(`/admin/courses/${publicId}`), 2000);
    } catch (err) {
      console.error("Error updating course:", err);
      setSnackbarMessage("Error updating course.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }} maxWidth="sm">
      <Typography variant="h4" gutterBottom>Edit Course</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Course Name"
            name="name"
            fullWidth
            margin="normal"
            value={courseData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Instructor"
            name="instructor"
            fullWidth
            margin="normal"
            value={courseData.instructor}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={courseData.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            inputProps={{ step: "0.01" }}
            fullWidth
            margin="normal"
            value={courseData.price}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Thumbnail Mode</FormLabel>
            <RadioGroup
              row
              value={thumbnailMode}
              onChange={(e) => {
                setThumbnailMode(e.target.value);
                if (e.target.value === "link") {
                  setThumbnailFile(null);
                  setImagePreview(courseData.thumbnail);
                } else {
                  setCourseData({ ...courseData, thumbnail: "" });
                  setImagePreview("");
                }
              }}
            >
              <FormControlLabel value="link" control={<Radio />} label="Link" />
              <FormControlLabel value="upload" control={<Radio />} label="Upload" />
            </RadioGroup>
          </FormControl>

          {thumbnailMode === "link" ? (
            <TextField
              fullWidth
              label="Thumbnail URL"
              name="thumbnail"
              value={courseData.thumbnail}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          ) : (
            <Box sx={{ mt: 2 }}>
              {thumbnailFile && (
                <>
                  <Typography fontStyle="italic" color="text.secondary">
                    New Thumbnail: {thumbnailFile.name}
                  </Typography>
                  <img
                    src={imagePreview}
                    alt="preview"
                    width="100%"
                    style={{ marginTop: 8, borderRadius: 4 }}
                  />
                </>
              )}
              {!thumbnailFile && imagePreview && (
                <img
                  src={imagePreview}
                  alt="Current thumbnail"
                  width="100%"
                  style={{ marginTop: 8, borderRadius: 4 }}
                />
              )}
              <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

          )}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>

        </form>
      </Paper>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default EditCourse;
