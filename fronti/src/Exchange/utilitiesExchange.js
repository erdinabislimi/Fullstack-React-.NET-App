import {jwtDecode} from 'jwt-decode';

export const getExchangesByUserId = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      const userId = decoded?.nameid || decoded?.id;
      if (!userId) throw new Error('User ID not found in token');
      return userId;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      return null;
    }
  };
  

  