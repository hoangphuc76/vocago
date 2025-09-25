import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  Slide,
  useScrollTrigger,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const { cartItems } = useContext(CartContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    window.location.href = '/';
  };

  const navLinkStyle = {
    color: "white",
    position: "relative",
    textTransform: "uppercase",
    fontWeight: 600,
    "&::after": {
      content: '""',
      position: "absolute",
      width: 0,
      height: "2px",
      bottom: 0,
      left: "50%",
      backgroundColor: "cyan",
      transition: "all 0.3s ease-in-out",
    },
    "&:hover::after": {
      left: 0,
      width: "100%",
    },
    "&:hover": {
      color: "cyan",
      transform: "scale(1.05)",
    },
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={10}
        sx={{
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          zIndex: 1000,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 6 } }}>
          <Box display="flex" alignItems="center" gap={1}>
            <RocketLaunchIcon fontSize="large" sx={{ color: "cyan" }} />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "#fff",
                fontWeight: 900,
                fontFamily: "monospace",
                textShadow: "0 0 10px cyan, 0 0 20px cyan",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.1)" },
                caretColor: "transparent",
              }}
            >
              Vocago
            </Typography>
          </Box>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <Box
                  sx={{
                    width: 240,
                    bgcolor: "#0f2027",
                    height: "100%",
                    px: 2,
                    py: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {role === "admin" && (
                    <Button component={Link} to="/admin" fullWidth sx={navLinkStyle} startIcon={<AdminPanelSettingsIcon />}>
                      Admin
                    </Button>
                  )}
                  <Button component={Link} to="/vocab-quiz" fullWidth sx={navLinkStyle}>Quiz</Button>
                  {/* <Button component={Link} to="/programs" fullWidth sx={navLinkStyle}>Programs</Button> */}
                  <Button component={Link} to="/exams" fullWidth sx={navLinkStyle}>Exams</Button>
                  {/* <Button component={Link} to="/courses" fullWidth sx={navLinkStyle}>Courses</Button> */}
                  
                  {isLoggedIn && (
                    <Button component={Link} to="/courses-user" fullWidth sx={navLinkStyle}>My Learning</Button>
                  )}

                  <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.2)" }} />

                  {isLoggedIn ? (
                    <Button onClick={handleLogout} fullWidth sx={navLinkStyle}>Logout</Button>
                  ) : (
                    <>
                      <Button component={Link} to="/login" fullWidth sx={navLinkStyle}>Login</Button>
                      <Button component={Link} to="/register" fullWidth sx={navLinkStyle}>Register</Button>
                    </>
                  )}
                </Box>
              </Drawer>
            </>

          ) :
            <Box display="flex" alignItems="center" gap={2}>
              {role === 'admin' && (
                <Button component={Link} to="/admin" startIcon={<AdminPanelSettingsIcon />} sx={navLinkStyle}>
                  Admin
                </Button>
              )}
              <Button component={Link} to="/vocab-quiz" sx={navLinkStyle}>Quiz</Button>
              {/* <Button component={Link} to="/programs" sx={navLinkStyle}>Programs</Button> */}
              <Button component={Link} to="/exams" sx={navLinkStyle}>Exams</Button>
              {/* <Button component={Link} to="/courses" sx={navLinkStyle}>Courses</Button> */}
              

              {isLoggedIn ? (
                <>
                  {/* <Button component={Link} to="/courses-user" sx={navLinkStyle}>My Learning</Button> */}

                  <IconButton component={Link} to="/cart" sx={{ color: "white", "&:hover": { color: "lime" } }}>
                    <Badge badgeContent={cartItems.length} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>

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
                      component={Link}
                      to="/profile"
                    >
                      {username.charAt(0).toUpperCase()}
                    </Avatar>

                  </Tooltip>

                  <Button onClick={handleLogout} sx={navLinkStyle}>Logout</Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" sx={navLinkStyle}>Login</Button>
                  <Button component={Link} to="/register" sx={navLinkStyle}>Register</Button>
                </>
              )}
            </Box>
          }
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
