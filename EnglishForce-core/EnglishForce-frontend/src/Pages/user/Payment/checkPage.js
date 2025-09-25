import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutPage from './Checkout.js';

// Check if the Stripe key is available
const stripeKey = process.env.REACT_APP_STRIPE_TEST_KEY;
let stripePromise;

if (stripeKey) {
  stripePromise = loadStripe(stripeKey);
} else {
  console.error('Stripe publishable key is missing. Please check your .env file.');
  stripePromise = null;
}

const App = () => {
  // Show an error message if Stripe key is missing
  if (!stripeKey) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Payment system configuration error</h2>
        <p>Stripe publishable key is missing. Please contact the administrator.</p>
      </div>
    );
  }

  return (
    <>
      {!stripePromise ? (
        <div style={{ padding: 16, color: 'crimson' }}>
          Stripe is not configured. Please set REACT_APP_STRIPE_TEST_KEY in your frontend .env and restart the app.
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutPage/>
        </Elements>
      )}
    </>
  );
};

export default App;
