// ExchangeForm.js
import React, { useState, useEffect } from 'react';
import apiService from './apiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import { getUserIdFromToken } from '../components/Navbar/utilities';
import api from '../api'; 

const ExchangeForm = ({ open, onClose, libriId }) => {
  const [nrPersonal, setNrPersonal] = useState('');
  const [status, setStatus] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserNrPersonal = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const userId = getUserIdFromToken(token);
        if (userId) {
          const response = await api.get(`/Klient/${userId}`);
          setNrPersonal(response.data.nrPersonal || '');
        }
      } catch (error) {
        console.error('Error fetching user NrPersonal:', error);
      }
    };

    if (open) {
      fetchUserNrPersonal(); 
      setStatus(''); 
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const exchangeDTO = { nrPersonal, libriId, status };

    try {
      await apiService.createExchange(exchangeDTO);
      setShowToast(true);       
      setErrorMessage('');     
      onClose();                  
    } catch (error) {
      setErrorMessage(error.response ? error.response.data : 'Error creating exchange.');
    }
  };

  const handleToastClose = () => setShowToast(false); 
  return (
    <>
      {/* Exchange Creation Modal */}
      <Modal show={open} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Exchange</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNrPersonal">
              <Form.Label>Nr Personal:</Form.Label>
              <Form.Control
                type="text"
                value={nrPersonal}
                readOnly 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLibriId">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                value={libriId}
                readOnly
                hidden
              />
            </Form.Group>
            <Button
              variant="current"
              type="submit"
              style={{ backgroundColor: '#001524', color: '#fff' }}
            >
              Create Exchange
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Toast */}
      <Toast
        show={showToast}
        onClose={handleToastClose}
        delay={5000}      
        autohide         
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          minWidth: '250px',
          zIndex: 9999,
        }}
      >
        <Toast.Header closeButton={false} className="text-white">
          <strong>Exchange Submitted</strong>
        </Toast.Header>
        <Toast.Body>
          Exchange has been sent for approval.
        </Toast.Body>
      </Toast>
    </>
  );
};

export default ExchangeForm;
