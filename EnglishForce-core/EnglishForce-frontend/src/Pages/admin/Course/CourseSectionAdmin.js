import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, TextField, Button, Paper, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axiosInstance from "../../../Api/axiosInstance";



const AdminCourseSections = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadMode, setUploadMode] = useState("link"); // "link" | "upload"
  const [videoFile, setVideoFile] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");



  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`/course_sections/course/${publicId}`);
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };
  useEffect(() => {
    fetchSections();
  }, []);

  const handleAddSection = async () => {
    const formData = new FormData();
    formData.append("name",name) ;
    formData.append("description",description) ;
    formData.append("course_public_id",publicId);
    formData.append("order_index",orderIndex) ;

    if (uploadMode === "upload" && videoFile) formData.append("video", videoFile);
    else formData.append("video_link",videoLink) ;
    console.log(videoFile)

    try {
      const response = await axiosInstance.post(
        "/course_sections", formData,{headers:{"Content-Type": "multipart/form-data"}}
      );
      setSections([...sections, response.data]);
      setSnackbarMessage("Section added successfully!");
      setOpenSnackbar(true);
      setName("");
      setDescription("");
      setUploadMode("link");
      setVideoLink("");
      setVideoFile(null);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const handleDeleteSection = async (publicId) => {
    try {
      await axiosInstance.delete(`/course_sections/${publicId}`);
      setSections(sections.filter((s) => s.public_id !== publicId));
      setSnackbarMessage("Section deleted!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4">Manage Course Sections</Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleAddSection(); }}>
          <TextField label="Section Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
          <TextField label="Description" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" required />
          <TextField label="Order Index" fullWidth value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} margin="normal" type="number" required />

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Video Input Mode</FormLabel>
            <RadioGroup row value={uploadMode} onChange={(e) => setUploadMode(e.target.value)}>
              <FormControlLabel value="link" control={<Radio />} label="Link" />
              <FormControlLabel value="upload" control={<Radio />} label="Upload" />
            </RadioGroup>
          </FormControl>

          {uploadMode === "link" ? (
            <TextField label="Video Link" fullWidth value={videoLink} onChange={(e) => setVideoLink(e.target.value)} margin="normal" />
          ) : (
            <> <br />
              <Button variant="outlined" component="label">
                Upload MP4
                <input type="file" accept="video/mp4" hidden onChange={(e) => setVideoFile(e.target.files[0])} />
              </Button>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {videoFile ? `Selected file: ${videoFile.name}` : "No file selected"}
              </Typography>
              </>
          )}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add Section</Button>
        </form>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Order Index</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.id}</TableCell>
                <TableCell>{section.name}</TableCell>
                <TableCell>{section.description}</TableCell>
                <TableCell><a href={section.video_link} target="_blank" rel="noopener noreferrer">Watch</a></TableCell>
                <TableCell>{section.order_index}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/admin/courses/sections/${section.public_id}/edit`)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteSection(section.public_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCourseSections;
