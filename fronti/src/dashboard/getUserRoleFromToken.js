import {jwtDecode} from 'jwt-decode';

export default function getUserRoleFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded?.role || decoded?.rol || null; 
  } catch (error) {
    console.error('Error decoding role from token:', error);
    return null;
  }
}
