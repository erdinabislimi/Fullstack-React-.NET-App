import axios from 'axios';

const API_BASE_URL = 'https://localhost:7101/api/Exchange'; 

const apiService = {
  getAllExchanges: async () => {
    return axios.get(API_BASE_URL);
  },
  
  getExchangesByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/User/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exchanges for user ID ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  getClientById: async (klientId) => {
    const response = await fetch(`/Klient/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch client details');
    }
    return await response.json();
  },
  createExchange: async (exchangeData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}`, exchangeData);
      return response.data;
    } catch (error) {
      console.error('Error creating exchange:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateExchange: async (id, updatedExchange) => {
    try {
      return await axios.put(`${API_BASE_URL}/${id}`, updatedExchange);
    } catch (error) {
      console.error('Error updating exchange:', error.response ? error.response.data : error.message);
      throw error; 
    }
  },

  deleteExchange: async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/Delete/${id}`);
    } catch (error) {
      console.error(`Error deleting exchange with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  approveExchange: async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/Approve/${id}`);
    } catch (error) {
      console.error(`Error approving exchange with ID ${id}:`, error);
      throw error;
    }
  },
};

export default apiService;