import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance";

const EditProgramPage = () => {
  const { publicProgramId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailMode, setThumbnailMode] = useState("link");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axiosInstance.get(`/programs/${publicProgramId}`);
        const program = res.data;
        setName(program.name);
        setDescription(program.description);
        setOrderIndex(program.order_index || 0);
        setThumbnailUrl(program.thumbnail || "");
      } catch (error) {
        console.error("❌ Error fetching program:", error);
        setSnackbar({ open: true, message: "Failed to load program", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [publicProgramId]);

  const handleSubmit = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("order_index", orderIndex);

      if (thumbnailMode === "link" && thumbnailUrl) {
        formData.append("thumbnail", thumbnailUrl);
      } else if (thumbnailMode === "upload" && selectedThumbnail) {
        formData.append("thumbnail", selectedThumbnail);
      }

      await axiosInstance.put(`/programs/${publicProgramId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbar({ open: true, message: "Program updated successfully", severity: "success" });
      setTimeout(() => navigate("/admin/programs"), 1500);
    } catch (error) {
      console.error("❌ Error updating program:", error);
      setSnackbar({ open: true, message: "Failed to update program", severity: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Edit Program
      </Typography>

      <TextField
        label="Program Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Order Index"
        type="number"
        value={orderIndex}
        onChange={(e) => setOrderIndex(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Thumbnail Input Mode</FormLabel>
        <RadioGroup
          row
          value={thumbnailMode}
          onChange={(e) => setThumbnailMode(e.target.value)}
        >
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
          sx={{ mb: 2 }}
        />
      ) : (
        <Box sx={{ mb: 2 }}>
          {selectedThumbnail ? (
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
          ) : thumbnailUrl ? (
            <>
              <Typography fontStyle="italic" color="text.secondary">
                Current Thumbnail
              </Typography>
              <img
                src={thumbnailUrl}
                alt="current"
                width="100%"
                style={{ marginTop: 8, borderRadius: 4 }}
              />
            </>
          ) : null}
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

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={uploading}
        fullWidth
        sx={{ mt: 3 }}
      >
        {uploading ? <CircularProgress size={24} /> : "Update Program"}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProgramPage;
