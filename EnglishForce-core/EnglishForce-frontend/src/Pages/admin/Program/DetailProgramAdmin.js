import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Container,
  Box,
  CircularProgress,
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../Api/axiosInstance';

const DetailProgramAdmin = () => {
  const { publicProgramId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUnit, setNewUnit] = useState({
    name: '',
    description: '',
    order_index: 0,
  });
  const [creating, setCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        const res = await axiosInstance.get(`/programs/${publicProgramId}`);
        setProgram(res.data);
      } catch (err) {
        console.error('Failed to fetch program detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetail();
  }, [publicProgramId]);

  const handleCreateUnit = async () => {
    if (!newUnit.name.trim()) {
      alert('Unit name is required');
      return;
    }

    try {
      setCreating(true);
      await axiosInstance.post('/units', {
        program_public_id: publicProgramId,
        ...newUnit,
      });

      setSnackbar({ open: true, message: 'Unit created!', severity: 'success' });
      setNewUnit({ name: '', description: '', order_index: 0 });

      const res = await axiosInstance.get(`/programs/${publicProgramId}`);
      setProgram(res.data);
    } catch (err) {
      console.error('Failed to create unit:', err);
      setSnackbar({ open: true, message: 'Error creating unit', severity: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUnit = async (unitPublicId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this unit?')) return;

    try {
      await axiosInstance.delete(`/units/${unitPublicId}`);
      setSnackbar({ open: true, message: 'Unit deleted!', severity: 'success' });

      const res = await axiosInstance.get(`/programs/${publicProgramId}`);
      setProgram(res.data);
    } catch (err) {
      console.error('Failed to delete unit:', err);
      setSnackbar({ open: true, message: 'Error deleting unit', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!program) {
    return (
      <Typography variant="h6" align="center" color="error" mt={5}>
        Program not found.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{program.name}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/programs/${program.public_id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {program.description}
      </Typography>

      {/* Add Unit Section */}
      <Box sx={{ border: '1px solid gray', p: 2, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Unit
        </Typography>

        <TextField
          label="Unit Name"
          fullWidth
          sx={{ mb: 2 }}
          value={newUnit.name}
          onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
          value={newUnit.description}
          onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
        />

        <TextField
          label="Order Index"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={newUnit.order_index}
          onChange={(e) => setNewUnit({ ...newUnit, order_index: parseInt(e.target.value, 10) })}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateUnit}
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Add Unit'}
        </Button>
      </Box>

      {program.Units?.map((unit, index) => (
        <Card key={unit.public_id} sx={{ mb: 3 }}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() =>
              navigate(`/admin/programs/${publicProgramId}/units/${unit.public_id}`)
            }
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Unit {index + 1}: {unit.name}
              </Typography>
              {unit.description && (
                <Typography variant="body2" color="text.secondary">
                  {unit.description}
                </Typography>
              )}
            </Box>
            <IconButton onClick={(e) => handleDeleteUnit(unit.public_id, e)} color="error">
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}

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

export default DetailProgramAdmin;
