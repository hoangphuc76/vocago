import React, { useEffect, useState } from "react";
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

const ExamPartEditPage = () => {
  const { publicId, partPublicId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [recordUrl, setRecordUrl] = useState("");

  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [thumbnailMode, setThumbnailMode] = useState("link");
  const [recordMode, setRecordMode] = useState("link");

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const res = await axiosInstance.get(`/exam-parts/${partPublicId}`);
        const part = res.data;
        setName(part.name || "");
        setDescription(part.description || "");
        setThumbnailUrl(part.thumbnail || "");
        setRecordUrl(part.record || "");
        setLoading(false);
      } catch (err) {
        console.error("Failed to load exam part", err);
      }
    };
    fetchPart();
  }, [partPublicId]);

  const handleSubmit = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (thumbnailMode === "link" && thumbnailUrl) {
        formData.append("thumbnail", thumbnailUrl);
      } else if (thumbnailMode === "upload" && selectedThumbnail) {
        formData.append("thumbnail", selectedThumbnail);
      }

      if (recordMode === "link" && recordUrl) {
        formData.append("record", recordUrl);
      } else if (recordMode === "upload" && selectedRecord) {
        formData.append("record", selectedRecord);
      }

      await axiosInstance.put(`/exam-parts/${partPublicId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbar({ open: true, message: "Exam part updated successfully", severity: "success" });
      setTimeout(() => navigate(`/admin/exams/${publicId}`), 1000);
    } catch (error) {
      console.error("Error updating part:", error);
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Edit Exam Part
      </Typography>

      <TextField
        label="Part Name"
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
        sx={{ mb: 3 }}
      />

      {/* Thumbnail Section */}
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
          ) : (
            thumbnailUrl && (
              <>
                <Typography fontStyle="italic" color="text.secondary">
                  Current Thumbnail:
                </Typography>
                <img
                  src={thumbnailUrl}
                  alt="current thumbnail"
                  width="100%"
                  style={{ marginTop: 8, borderRadius: 4 }}
                />
              </>
            )
          )}
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
            Upload new thumbnail
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setSelectedThumbnail(e.target.files[0])}
            />
          </Button>
        </Box>
      )}

      {/* Record Section */}
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Record Input Mode</FormLabel>
        <RadioGroup
          row
          value={recordMode}
          onChange={(e) => setRecordMode(e.target.value)}
        >
          <FormControlLabel value="link" control={<Radio />} label="Link" />
          <FormControlLabel value="upload" control={<Radio />} label="Upload" />
        </RadioGroup>
      </FormControl>

      {recordMode === "link" ? (
        <TextField
          fullWidth
          label="Record URL"
          value={recordUrl}
          onChange={(e) => setRecordUrl(e.target.value)}
          sx={{ mb: 3 }}
        />
      ) : (
        <Box sx={{ mb: 3 }}>
          {selectedRecord ? (
            <Typography fontStyle="italic" color="text.secondary">
              New Record: {selectedRecord.name}
            </Typography>
          ) : (
            recordUrl && (
              <>
                <Typography fontStyle="italic" color="text.secondary">
                  Current Record:
                </Typography>
                <audio controls src={recordUrl} style={{ width: "100%", marginTop: 8 }} />
              </>
            )
          )}
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
            Upload new record
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={(e) => setSelectedRecord(e.target.files[0])}
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
        {uploading ? "Saving..." : "Save Changes"}
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

export default ExamPartEditPage;
