import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../Api/axiosInstance.js';
import { CartContext } from '../../../Context/CartContext.js';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Box,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, setCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const [openAlert, setOpenAlert] = useState(false);
  const [removedItems, setRemovedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const res = await axiosInstance.get('/user-course/user');
        const userCourses = res.data || [];
        console.log(userCourses)
        const ownedCourseIds = userCourses.map((c) => c.public_id);
        console.log(ownedCourseIds)
        const removedThings = [];
        const keptThings = []
        cartItems.forEach((item) => {
          if (ownedCourseIds.includes(item.public_id)) removedThings.push(item.name);
          else keptThings.push(item);
        });

        if (removedThings.length > 0) {
          setRemovedItems(removedThings);
          setCart(keptThings);
          setOpenAlert(true);
        }
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
      }
    };

    if (cartItems.length > 0) {
      fetchUserCourses();
    }
  }, [cartItems]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <img
              src="/empty_cart.png"
              alt="Empty Cart"
              style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}
            />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Your cart is empty.
          </Typography>
          <Typography variant="body1">
            It seems you haven't added any items to your cart yet.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Your Cart
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {cartItems.map((item) => (
            <Box key={item.public_id}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeFromCart(item)}
                  >
                    Delete
                  </Button>
                }
              >
                <img
                  src={item.thumbnail? item.thumbnail : "/Errores-Web-404.jpg"}
                  alt={item.name}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 5 , marginRight: 16, }}
                />
                <ListItemText
                  primary={item.name}
                  secondary={`$${item.price ? item.price : 0}`}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Total: ${getCartTotal()}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/payment')}>
              Payment
            </Button>
            <Button variant="contained" color="error" onClick={clearCart}>
              Clear All
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setOpenAlert(false)}>
          {removedItems.length > 0
            ? `Removed already owned courses: ${removedItems.join(', ')}`
            : 'Some courses were already in your account.'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;