import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [userRole, setUserRole] = useState(null);
  const history = useHistory();

  const login = (authToken) => {
    localStorage.setItem('authToken', authToken);
    const decodedToken = jwtDecode(authToken);
    setUserRole(decodedToken.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUserRole(null);
    history.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role); 
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
