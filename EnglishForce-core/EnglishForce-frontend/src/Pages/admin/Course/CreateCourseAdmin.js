import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, TextField, Button, Paper, Snackbar, Alert, InputAdornment,
  CircularProgress, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";

const CreateCourseAdmin = () => {
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [thumbnailMode, setThumbnailMode] = useState("link");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();


  const checkPrice = (price) => {
    const numericPrice = parseFloat(price);
    return numericPrice === 0 || numericPrice >= 1;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkPrice(price)) {
      setSnackbarMessage("Price must be 0 (free) or greater than or equal to 1$.");
      setOpenSnackbar(true);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("instructor", instructor);
    formData.append("description", description);
    formData.append("price", price);

    if (thumbnailMode === "link") {
      formData.append("thumbnail", thumbnailUrl);
    } else if (thumbnailMode === "upload" && selectedThumbnail) {
      formData.append("thumbnail", selectedThumbnail);
    }

    try {
      setUploading(true);
      await axiosInstance.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbarMessage("Course created successfully!");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/admin/courses"), 2000);
    } catch (error) {
      console.error("Error creating course:", error);
      setSnackbarMessage("Error creating course, please try again.");
      setOpenSnackbar(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Create New Course</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Course Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
          <TextField label="Instructor" fullWidth value={instructor} onChange={(e) => setInstructor(e.target.value)} margin="normal" required />
          <TextField label="Description" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" required />
          <TextField
            label="Price"
            fullWidth
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            required
            inputProps={{ step: "0.01" }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          />

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Thumbnail Mode</FormLabel>
            <RadioGroup row value={thumbnailMode} onChange={(e) => setThumbnailMode(e.target.value)}>
              <FormControlLabel value="link" control={<Radio />} label="Link" />
              <FormControlLabel value="upload" control={<Radio />} label="Upload" />
            </RadioGroup>
          </FormControl>

          {thumbnailMode === "link" ? (
            <TextField
              fullWidth
              label="Thumbnail URL"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              sx={{ mt: 2 }}
            />
          ) : (
            <Box sx={{ mt: 2 }}>
              {selectedThumbnail && (
                <>
                  <Typography fontStyle="italic" color="text.secondary">
                    New Thumbnail: {selectedThumbnail.name}
                  </Typography>
                  <img
                    src={URL.createObjectURL(selectedThumbnail)}
                    alt="preview"
                    width="100%"
                    style={{ marginTop: 8, borderRadius: 4 }}
                  />
                </>
              )}
              <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setSelectedThumbnail(e.target.files[0])}
                />
              </Button>
            </Box>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : "Create Course"}
          </Button>
        </form>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarMessage.includes("success") ? "success" : "error"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateCourseAdmin;
