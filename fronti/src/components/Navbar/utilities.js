import {jwtDecode} from 'jwt-decode';

export const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    return decoded?.nameid || decoded?.id; 
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
