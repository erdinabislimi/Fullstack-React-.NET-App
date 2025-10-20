import React, { createContext, useState } from 'react';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  return (
    <PaymentContext.Provider value={{ paymentCompleted, setPaymentCompleted }}>
      {children}
    </PaymentContext.Provider>
  );
};
