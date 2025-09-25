import React from "react";
import { Container, Box } from "@mui/material";
import Header from "../Components/user/Header";
import Footer from "../Components/Footer";
import { useGlobalShortcut } from "../hooks/useGlobalShortcut";

import Chatbot from "../Components/user/ChatBot";

const Layout = ({ children, isHomePage = false  }) => {
  // Enable global shortcut for vocab collections
  useGlobalShortcut();

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />


      {isHomePage ? (
        // Trang Home không bọc Container, có thể style khác
        <Box component="main" sx={{ flexGrow: 1, mt: 0, mb: 0 }}>
          {children}
        </Box>
      ) : (
        // Các trang khác bọc Container với margin top-bottom
        <Container component="main" sx={{ flexGrow: 1, mt: 3, mb: 3 }}>
          {children}
        </Container>
      )}


      <Chatbot />
      <Footer />
    </Box>
  );
};

export default Layout;