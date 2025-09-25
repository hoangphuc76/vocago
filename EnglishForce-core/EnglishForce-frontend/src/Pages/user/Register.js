import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Divider } from "@mui/material";
import axiosInstance from "../../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import OAuthLoginButtons from '../../Components/OAuthLoginButtons.js';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate() ;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.username === "") {
      alert("Please enter username");
      return;
    }
    if (formData.password === "") {
      alert("Please enter password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        username: formData.username,
        password: formData.password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response && error.response.data) alert("Username already exists. Please choose another username!")
      else {
        alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
        alert(`${formData.username}  ${formData.password}`)
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create Your Account
        </Typography>
      </Box>

      <Box component="form" noValidate mt={3}>
        <TextField fullWidth label="User Name" name="username" onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" onChange={handleChange} margin="normal" required />

        <Button fullWidth variant="contained" color="primary" size="large" sx={{ mt: 3 }} onClick={handleRegister}>
          Register
        </Button>
        <Divider sx={{ my: 3 }}>or login with</Divider>
        <OAuthLoginButtons/>
      </Box>
    </Container>
  );
};

export default RegisterPage;
