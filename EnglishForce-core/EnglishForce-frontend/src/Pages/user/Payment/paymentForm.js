import React, { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Container, Typography, Button, Box, CircularProgress, TextField,
  Snackbar, Card, CardContent
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { SiStripe } from 'react-icons/si';
import { MdPayment } from 'react-icons/md';
import axiosInstance from '../../../Api/axiosInstance';
import { CartContext } from "../../../Context/CartContext";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const PaymentForm = ({ totalAmount, courseIds }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [nameOnCard, setNameOnCard] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSuccess, setSnackbarSuccess] = useState(true);
  const { clearCart } = useContext(CartContext);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setMessage('');

    try {
      const amountCents = Math.round(totalAmount * 100);
      const response = await axiosInstance.post('/payments/create-payment-intent', {
        amount: amountCents, courseIds
      });

      const data = response.data;

      if (data.freeOrder) {
        const msg = 'Order processed as free. Payment succeeded!';
        setMessage(msg);
        setSnackbarSuccess(true);
        setSnackbarOpen(true);
        localStorage.removeItem('cartItems');
        clearCart();
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
        setSnackbarSuccess(false);
        setSnackbarOpen(true);
      } else if (result.paymentIntent?.status === 'succeeded') {
        const msg = 'Payment succeeded!';
        setMessage(msg);
        setSnackbarSuccess(true);
        setSnackbarOpen(true);
        localStorage.removeItem('cartItems');
        clearCart();
      }
    } catch (error) {
      setMessage('Payment failed. Please try again.');
      setSnackbarSuccess(false);
      setSnackbarOpen(true);
    }

    setIsProcessing(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card>
        <CardContent>
          <Box textAlign="center" mb={2}>
            <MdPayment size={36} color="#1976d2" />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Payment with Stripe
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            {totalAmount > 0 && (
              <Box>
                <TextField
                  label="Name on Card"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 2,
                    mt: 2,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#9e2146' },
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!stripe || isProcessing}
              fullWidth
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                mt: 3
              }}
            >
              {isProcessing ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                <>
                  <SiStripe size={20} />
                  {`Pay $${totalAmount}`}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSuccess ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentForm;
