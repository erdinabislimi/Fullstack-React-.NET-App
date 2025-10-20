import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import api from '../api'; 
import apiServicePay from './apiServicePay'; 
import { getPaymentByUserId } from './utilitiesPayment';

const PaymentForm = ({ open, onClose, exchangeId }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    klientId: '',
    amount: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const userId = getPaymentByUserId(token);
        console.log('Extracted User ID:', userId);

        if (userId) {
          const response = await api.get(`/Klient/${userId}`);
          setPaymentDetails({
            klientId: userId,
            amount: response.data.amount || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
        setErrorMessage('Error fetching user information.');
      }
    };

    if (open) {
      fetchUserInfo();
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!paymentDetails.amount || isNaN(paymentDetails.amount) || paymentDetails.amount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      return;
    }
  
    const paymentDTO = {
      klientId: paymentDetails.klientId,
      amount: parseFloat(paymentDetails.amount),
      paymentStatus: 'Completed', 
    };
  
    console.log('Request payload:', paymentDTO);
  
    setLoading(true);
    try {
      await apiServicePay.processPayment(paymentDTO);
      setShowToast(true);
      setErrorMessage('');
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error.response?.data);
  
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        const errorMessages = Object.entries(apiErrors)
          .map(([field, messages]) => {
            const messagesArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${messagesArray.join(', ')}`;
          })
          .join('\n');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleToastClose = () => setShowToast(false);

  return (
    <>
      <Modal show={open} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount:</Form.Label>
              <Form.Control
                type="text"
                value={paymentDetails.amount || ''}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, amount: e.target.value })
                }
                required
                disabled={loading}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              style={{ backgroundColor: '#001524', color: '#fff' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Process Payment'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Toast
        show={showToast}
        onClose={handleToastClose}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          minWidth: '250px',
          zIndex: 9999,
        }}
      >
        <Toast.Header closeButton={false} className="text-white">
          <strong>Payment Successful</strong>
        </Toast.Header>
        <Toast.Body>
          Your payment has been successfully processed. Thank you for your purchase.
        </Toast.Body>
      </Toast>
    </>
  );
};

export default PaymentForm;
