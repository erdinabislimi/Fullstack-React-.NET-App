import React, { useEffect, useState } from 'react';
import notificationService from './notificationService'; 
import { Container, ListGroup, Button, Modal, Alert } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Notification = ({ showModal, toggleModal }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminMessage, setAdminMessage] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await notificationService.fetchNotifications();

      if (notificationsData && notificationsData.$values) {
        setNotifications(notificationsData.$values); 
      } else {
        setError('Invalid notifications data structure');
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching notifications');
      setLoading(false);
    }
  };

  const handleApprove = async (notificationId) => {
    try {
      await notificationService.approveNotification(notificationId);
      const notification = notifications.find(n => n.notificationId === notificationId);
      setAdminMessage(`The request for "${notification?.message}" has been approved.`);
      fetchNotifications(); 
    } catch (error) {
      setAdminMessage('Error approving the request.');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const notification = notifications.find(n => n.notificationId === notificationId);
      setAdminMessage(`The request for "${notification?.message}" has been deleted.`);
      fetchNotifications(); 
    } catch (error) {
      setAdminMessage('Error deleting the request.');
    }
  };

  if (loading) {
    return <Container>Loading...</Container>; 
  }

  if (error) {
    return <Container>Error: {error}</Container>; 
  }

  return (
    <Modal 
      show={showModal} 
      onHide={toggleModal} 
      dialogClassName="modal-dialog-centered"
    >
      {/* Modal Header */}
      <Modal.Header 
        className="justify-content-center" 
        style={{ 
          borderBottom: 'none', 
          color: 'white', 
          backgroundColor: '#001524' 
        }}
      >
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
  
      {/* Modal Body */}
      <Modal.Body 
        className="bg-light" 
        style={{ 
          color: '#333', 
          padding: '20px', 
          borderRadius: '5px', 
          maxHeight: '400px', 
          overflowY: 'auto' 
        }}
      >
        {notifications.length > 0 ? (
          <ListGroup>
            {notifications.map((notification) => (
              <ListGroup.Item 
                key={notification.notificationId}
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #ddd', 
                  borderRadius: '10px', 
                  marginBottom: '10px', 
                  padding: '15px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
                }}
              >
                {/* Notification Content */}
                <div style={{ flex: 1 }}>
                  <p 
                    style={{ 
                      margin: '0', 
                      fontWeight: 'bold', 
                      color: '#001524', 
                      fontSize: '16px' 
                    }}
                  >
                    {notification.message}
                  </p>
                  <p 
                    style={{ 
                      margin: '0', 
                      color: '#888', 
                      fontSize: '12px' 
                    }}
                  >
                    {new Date(notification.notificationTime).toLocaleString()}
                  </p>
                </div>
  
                {/* Unread Indicator */}
               
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p 
            style={{ 
              textAlign: 'center', 
              color: '#555', 
              fontSize: '16px', 
              marginTop: '20px' 
            }}
          >
            No notifications found.
          </p>
        )}
      </Modal.Body>
  
      {/* Modal Footer */}
      <Modal.Footer 
        className="bg-light" 
        style={{ 
          borderTop: 'none', 
          padding: '15px', 
          display: 'flex', 
          justifyContent: 'center' 
        }}
      >
        <Button 
          variant="" 
          onClick={toggleModal} 
          style={{ 
            backgroundColor: '#232d3b', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px', 
            padding: '10px 20px', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d2633'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#232d3b'}
        >
          Close
        </Button>
      </Modal.Footer>
  
      {/* Admin Message Alert */}
      {adminMessage && (
        <Alert 
          variant="info" 
          style={{ 
            margin: '20px', 
            textAlign: 'center', 
            borderRadius: '5px' 
          }}
        >
          {adminMessage}
        </Alert>
      )}
    </Modal>
  );
  
  
  

};

export default Notification;
