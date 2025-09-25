import React from 'react';
import { Typography } from '@mui/material';

const GradientTitle = ({ children, align = 'center', }) => {
  return (
    <Typography
      variant="h4"
      align={align}
      fontWeight={800}
      sx={{
        mb: 3,
        background: 'linear-gradient(to right, #1976d2, #7e57c2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        caretColor: "transparent",
      }}
    >
      {children}
    </Typography>
  );
};

export default GradientTitle;
