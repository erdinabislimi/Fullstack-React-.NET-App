import axios from 'axios';

const API_BASE_URL = 'https://localhost:7101/api/Payment';

const apiServicePay = {
  processPayment: async (paymentData) => {
    try {
      if (isNaN(paymentData.amount)) {
        throw new Error('Invalid amount. Amount must be a valid number.');
      }

      const formattedPaymentData = {
        ...paymentData,
        amount: parseFloat(paymentData.amount), 
      };

      console.log('Formatted Payment Data:', formattedPaymentData); 

      const response = await axios.post(`${API_BASE_URL}`, formattedPaymentData);

      console.log('Payment Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error.response ? error.response.data : error.message);
      throw error; 
    }
  },

  getPaymentById: async (paymentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${paymentId}`);
      return response.data; 
    } catch (error) {
      console.error(`Error fetching payment details for payment ID ${paymentId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getPaymentStatus: async (paymentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Status/${paymentId}`);
      return response.data; 
    } catch (error) {
      console.error(`Error fetching payment status for payment ID ${paymentId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  refundPayment: async (paymentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Refund`, { paymentId });
      return response.data; 
    } catch (error) {
      console.error(`Error processing refund for payment ID ${paymentId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  cancelPayment: async (paymentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Cancel`, { paymentId });
      return response.data;
    } catch (error) {
      console.error(`Error canceling payment for payment ID ${paymentId}:`, error.response?.data || error.message);
      throw error;
    }
  },

getPaymentById: async (paymentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${paymentId}`);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching payment details for payment ID ${paymentId}:`, error.response?.data || error.message);
    if (error.response && error.response.status === 404) {
      throw new Error(`Payment not found for ID: ${paymentId}`);
    } else {
      throw new Error(`Error fetching payment details: ${error.message}`);
    }
  }
}
}

export default apiServicePay;
