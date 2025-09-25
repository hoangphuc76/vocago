import React, { useState, useEffect, useContext  } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import { MdShoppingCart } from 'react-icons/md';
import { CartContext } from '../../../Context/CartContext';
import PaymentForm from './paymentForm';
import GradientTitle from '../../../Components/GradientTitle';

const CheckoutPage = () => {
  const { getCartTotal } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [courseIds, setCourseIds] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      const parsedItems = JSON.parse(items);
      setCartItems(parsedItems);
      setCourseIds(parsedItems.map((item) => item.id));
      setTotalAmount(getCartTotal) ; // Nếu dùng trực tiếp getCartTotal thì khi thanh toán => giá thay đổi => UI nhảy
    }
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <GradientTitle>Checkout</GradientTitle>
        {cartItems.length === 0 ? (
          <Typography variant="body1">Your cart is empty.</Typography>
        ) : (
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }} alignItems="stretch">
            <Box flex={1}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <MdShoppingCart size={24} color="#1976d2" />
                    <Typography variant="h6" fontWeight="bold">
                      Items in your cart
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      maxHeight: 350,
                      overflowY: 'auto',
                      pr: 1,
                    }}
                  >
                    <List>
                      {cartItems.map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start">
                            <img
                              src={item.thumbnail || "/Errores-Web-404.jpg"}
                              alt={item.name}
                              style={{
                                width: 80,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 5,
                                marginRight: 16,
                                border: '1px solid #ddd'
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography fontWeight={500}>{item.name}</Typography>
                              }
                              secondary={`Price: $${item.price || 0}`}
                            />
                          </ListItem>
                          {index < cartItems.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                </Box>

                <Box
                  mt={1}
                  mb={2.9}
                  p={1}
                  sx={{
                    border: '2px solid #1976d2',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    Total: ${totalAmount}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Payment Form */}
            <Box flex={1}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <PaymentForm totalAmount={totalAmount} courseIds={courseIds} />
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CheckoutPage;