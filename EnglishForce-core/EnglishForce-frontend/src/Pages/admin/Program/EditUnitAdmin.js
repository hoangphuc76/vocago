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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance";

const EditUnitAdmin = () => {
  const { unitPublicId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await axiosInstance.get(`/units/${unitPublicId}`);
        const unit = res.data;
        setName(unit.name);
        setDescription(unit.description);
        setOrderIndex(unit.order_index || 0);
      } catch (error) {
        console.error("❌ Error fetching unit:", error);
        setSnackbar({ open: true, message: "Failed to load unit", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitPublicId]);

  const handleSubmit = async () => {
    try {
      setUploading(true);
      await axiosInstance.put(`/units/${unitPublicId}`, {
        name,
        description,
        order_index: orderIndex,
      });

      setSnackbar({ open: true, message: "Unit updated successfully", severity: "success" });
      setTimeout(() => navigate(-1), 1500); // Quay về trang trước đó
    } catch (error) {
      console.error("❌ Error updating unit:", error);
      setSnackbar({ open: true, message: "Failed to update unit", severity: "error" });
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
        Edit Unit
      </Typography>

      <TextField
        label="Unit Name"
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

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={uploading}
        fullWidth
      >
        {uploading ? <CircularProgress size={24} /> : "Update Unit"}
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

export default EditUnitAdmin;
