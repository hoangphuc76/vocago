import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Paper, TextField, Button, CircularProgress,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";

const EditCourseSection = () => {
  const { publicId } = useParams(); // Lấy publicId từ URL
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [uploadMode, setUploadMode] = useState("link"); // "link" | "upload"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin section từ backend
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axiosInstance.get(`/course_sections/${publicId}`);
        setSection(response.data);
      } catch (err) {
        console.error("Error fetching section:", err);
        setError("Error fetching section details");
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [publicId]);

  // Xử lý thay đổi các trường trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gửi dữ liệu cập nhật lên backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", section.name);
      formData.append("description", section.description);
      formData.append("order_index", section.order_index);
    
      if (uploadMode === "link") {
        formData.append("video_link", section.video_link);
      } else if (section.videoFile) {
        formData.append("video", section.videoFile); // field name phải giống bên backend expect
      }

      await axiosInstance.put(`/course_sections/${publicId}`, formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(-1); // Quay lại trang trước đó sau khi cập nhật thành công
    } catch (err) {
      console.error("Error updating section:", err);
      setError("Error updating section");
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!section) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Section not found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Course Section
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Section Name" fullWidth margin="normal"
            name="name" value={section.name} onChange={handleChange}
          />
          <TextField
            label="Description" fullWidth margin="normal"
            name="description" value={section.description} onChange={handleChange}
            multiline rows={4}
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Video Input Mode</FormLabel>
            <RadioGroup row value={uploadMode} onChange={(e) => setUploadMode(e.target.value)}>
              <FormControlLabel value="link" control={<Radio />} label="Link" />
              <FormControlLabel value="upload" control={<Radio />} label="Upload" />
            </RadioGroup>
          </FormControl>
          {uploadMode === "link" ? (
            <TextField
              label="Video Link" fullWidth margin="normal"
              name="video_link" value={section.video_link} onChange={handleChange}
            />) : (
            <> <br />
              <Button variant="outlined" component="label">
                Upload MP4
                <input type="file" accept="video/mp4" hidden onChange={(e) => setSection((prev) => ({ ...prev, videoFile: e.target.files[0] }))} />
              </Button>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {section.videoFile ? `Selected file: ${section.videoFile.name}` : "No file selected"}
              </Typography>
            </>
          )}
          <TextField
            label="Order Index" fullWidth margin="normal"
            name="order_index" value={section.order_index} onChange={handleChange}
            type="number"
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCourseSection;
