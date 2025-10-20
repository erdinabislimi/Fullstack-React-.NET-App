import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import apiService from './apiService';
import { getExchangesByUserId } from './utilitiesExchange';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar/Navbar';
import Navbar from '../components/Navbar/Navbar';
const Exchange = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {

 

    const fetchExchanges = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token is missing.');
        
        const userId = getExchangesByUserId(token);
        if (!userId) throw new Error('User ID is undefined.');
    
        const exchangesData = await apiService.getExchangesByUserId(userId);
        
        if (exchangesData?.values?.$values) {
          setExchanges(exchangesData.values.$values);
        } else {
          console.warn('No exchanges found or unexpected data structure:', exchangesData);
          setExchanges([]);
        }
      } catch (error) {
        console.error('Error fetching exchanges:', error.message);
        setError(error.response?.data?.message || 'Error fetching exchanges.');
      } finally {
        setLoading(false);
      }
    };
    
    
      fetchExchanges();
    }, [isAuthenticated]);
    
    
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);


  if (!isAuthenticated) {
    return (
      <Container>
        <p>Please log in to view your exchanges.</p>
      </Container>
    );
  }

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return (
      <Container>
        <p>Error: {error}</p>
      </Container>
    );
  }

  if (!exchanges.length) {
    return (
      <Container>
        <p>No exchanges found.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
     <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
  <Navbar handleDrawerToggle={handleDrawerToggle} />
  <h1>Your Exchanges</h1>
</div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Exchange ID</th>
            <th>Status</th>
            <th>Client Name</th>
            <th>Book Title</th>
            <th>Exchange Date</th>
            <th>Return Date</th>
          </tr>
        </thead>
        <tbody>
          {exchanges.map((exchange) => (
            <tr key={exchange.exchangeId}>
              <td>{exchange.exchangeId}</td>
              <td>{exchange.status}</td>
              <td>{exchange.klientEmri || 'No client name available'}</td>
              <td>{exchange.libri?.titulli}</td>
              <td>{exchange.exchangeDate}</td>
              <td>{exchange.returnDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Exchange;