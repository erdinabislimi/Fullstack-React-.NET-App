import React, { useState, useEffect } from 'react';

function NotificationsPolling() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:7101/api/Notification');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchNotifications();
    
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, []);
  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }
  return (
    <div style={{ margin: 20 }}>
      <h2>Notifications (Polling)</h2>
      {notifications.length === 0 && (
        <p>No notifications found.</p>
      )}
      {notifications.map((notif) => (
        <div
          key={notif.notificationId}
          style={{
            backgroundColor: '#f8f8f8',
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '4px'
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{notif.message}</p>
          <small>{new Date(notif.notificationTime).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
export default NotificationsPolling;
