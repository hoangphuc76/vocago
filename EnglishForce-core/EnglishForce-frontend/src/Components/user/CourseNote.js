import { useState } from 'react';
import { TextField, Box, Typography, Button, Stack } from '@mui/material';
import axiosInstance from '../../Api/axiosInstance';

const CourseNote = ({ courseSectionId }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.post(`/course-notes`, {
        section_id: courseSectionId,
        content: note,
      });
      alert('✅ Ghi chú đã được lưu!');
    } catch (err) {
      alert('❌ Lưu ghi chú thất bại!');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom>
        📝 Ghi chú của bạn
      </Typography>
      <TextField
        placeholder="Ghi chú tại đây..."
        multiline
        rows={10}
        fullWidth
        value={note}
        onChange={(e) => setNote(e.target.value)}
        variant="outlined"
        sx={{
          fontSize: '1.2rem',
          backgroundColor: '#f9f9f9',
        }}
      />
      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : '💾 Lưu ghi chú'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CourseNote;
