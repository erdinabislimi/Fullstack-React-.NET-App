import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
const useMultiTabLogout = () => {
  const history = useHistory();
  const { logout } = useAuth();
  
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'logout-event') {
        logout();
        history.push('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [history, logout]);
};

export default useMultiTabLogout;
