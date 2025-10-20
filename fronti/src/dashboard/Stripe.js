import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';  

const stripePromise = loadStripe('your-publishable-key-here');

const StripePaymentWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm open={true} onClose={() => {}} exchangeId={123} />
    </Elements>
  );
};

export default StripePaymentWrapper;
