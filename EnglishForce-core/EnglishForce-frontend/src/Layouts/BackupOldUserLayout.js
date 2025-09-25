import React from "react";
import { Container, Box } from "@mui/material";
import Header from "../Components/user/Header";
import Footer from "../Components/Footer";

import Chatbot from "../Components/user/ChatBot";

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Container component="main" sx={{ flexGrow: 1, mt: 3, mb: 3 }}>
        {children}
      </Container>
      <Chatbot />
      <Footer />
    </Box>
  );
};

export default Layout;