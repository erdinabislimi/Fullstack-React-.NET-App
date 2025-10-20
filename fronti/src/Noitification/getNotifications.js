import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = 'https://localhost:7101/api'; 

const getNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Notification`);
      console.log('Notification API Response:', response.data); 

      if (Array.isArray(response.data.$values)) {
        setNotifications(response.data.$values);
      } else {
        console.error('Expected an array of notifications but received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="container">
      <h1 className="my-4 text-light">Notifications</h1>
      <Button variant="primary" onClick={toggleModal}>
        View Notifications
      </Button>

      <Modal show={showModal} onHide={toggleModal} dialogClassName="modal-dialog-centered">
        <Modal.Header className="justify-content-center bg-dark" style={{ borderBottom: 'none', color: 'white' }}>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark" style={{ color: 'white' }}>
          {notifications.map((notification, index) => (
            <div
              key={notification.notificationId}
              className="card my-3"
              style={{
                borderRadius: '10px',
                backgroundColor: '#343a40',
                color: 'white', 
              }}
            >
              <div className="card-body" style={{ borderRadius: '10px' }}>
                <p className="card-text">{notification.message}</p>
                <p className="card-text"><small>{notification.isRead ? 'Read' : 'Not Read'}</small></p>
                <p className="card-text"><small>{notification.klientId}</small></p>
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="bg-dark" style={{ borderTop: 'none', color: 'white' }}>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default getNotifications;