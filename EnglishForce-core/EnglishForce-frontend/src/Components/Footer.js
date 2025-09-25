import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#111827', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Vocago</Typography>
            <Typography variant="body2" color="gray">
              AI-powered English learning platform to master all four skills—anytime, anywhere.
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" gutterBottom>Quick Links</Typography>
            <Link href="/" color="inherit" underline="hover" display="block">Home</Link>
            <Link href="/courses" color="inherit" underline="hover" display="block">Courses</Link>
            <Link href="/exam" color="inherit" underline="hover" display="block">Practice Tests</Link>
            <Link href="/about" color="inherit" underline="hover" display="block">About Us</Link>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" gutterBottom>Support</Typography>
            <Link href="/faq" color="inherit" underline="hover" display="block">FAQs</Link>
            <Link href="/contact" color="inherit" underline="hover" display="block">Contact</Link>
            <Link href="/terms" color="inherit" underline="hover" display="block">Terms</Link>
            <Link href="/privacy" color="inherit" underline="hover" display="block">Privacy Policy</Link>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom>Follow Us</Typography>
            <Box mt={1}>
              <IconButton href="#" sx={{ color: 'white' }}><Facebook /></IconButton>
              <IconButton href="#" sx={{ color: 'white' }}><Instagram /></IconButton>
              <IconButton href="#" sx={{ color: 'white' }}><Twitter /></IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box mt={5} textAlign="center" borderTop={1} borderColor="gray" pt={3}>
          <Typography variant="body2" color="gray">
            © 2025 EnglishForce Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
