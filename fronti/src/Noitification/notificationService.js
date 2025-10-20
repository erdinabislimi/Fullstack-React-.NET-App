import api from '../api'; 

const API_URL = 'https://localhost:7101/api/Notification';

const notificationService = {
  fetchNotifications: async () => {
    try {
      const response = await api.get('/Notification/klient');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error; 
    }
  },
  fetchBookBackInStockNotifications: async () => {
    try {
        const response = await api.get('/Notification/bookBackInStock');
        return response.data;
    } catch (error) {
        console.error('Error fetching book back in stock notifications:', error);
        throw error;
    }
},


  createNotification: async (notification) => {
    try {
      const response = await api.post('/Notification', notification);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  updateNotification: async (id, notification) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, notification, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating notification:", error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get(`${API_URL}/unreadCount`);
      return response.data;
    } catch (error) {
      console.error("Error fetching unread notifications count:", error.response ? error.response.data : error.message);
      throw error;
    }
  },
markNotificationsAsRead:async () => {
    try {
      await api.post('/Notification/markAsRead');
      setNewNotifications([]); 
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }
  
};

export default notificationService;