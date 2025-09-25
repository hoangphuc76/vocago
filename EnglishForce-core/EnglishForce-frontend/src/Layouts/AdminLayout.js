import React, { useState, useEffect } from "react";
import AdminSidebar from "../Components/admin/AdminSidebar";
import Footer from "../Components/Footer";
import {
  AppBar, Toolbar, IconButton, Typography, Box, Button, Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SecurityIcon from "@mui/icons-material/Security";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Thanh Header */}
      <AppBar
        position="fixed"
        elevation={10}
        sx={{
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          backdropFilter: "blur(15px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          zIndex: 1201, // cao hơn Drawer
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleSidebar}
              sx={{
                "&:hover": {
                  color: "#90caf9",
                  transform: "scale(1.1)",
                  transition: "0.3s",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <SecurityIcon sx={{ color: "#90caf9" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                textShadow: "0 0 10px rgba(144,202,249,0.4)",
                letterSpacing: "1px",
                caretColor: "transparent",
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Tooltip title={`Hello, ${username}!`}>
                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                      width: 36,
                      height: 36,
                      fontSize: "1rem",
                      boxShadow: "0 0 8px #1976d2",
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0.6)" },
                        "70%": { boxShadow: "0 0 0 10px rgba(25, 118, 210, 0)" },
                        "100%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0)" },
                      },
                      cursor: "pointer",
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Nội dung chính */}
      <main style={{ marginTop: 64, paddingLeft: 260, padding: "20px", minHeight: "90vh" }}>
        {children}
      </main>
      <Footer />
    </Box>
  );
};

export default AdminLayout;
