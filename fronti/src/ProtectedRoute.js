

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
      
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }

        if (allowedRoles && !allowedRoles.includes(userRole)) {
          return <Redirect to="/home" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
