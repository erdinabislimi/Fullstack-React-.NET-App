import "../dashboard/styles.css";
import React, { Fragment, useEffect, useState } from 'react';
import apiService from './apiService'; // Import your exchange service
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Table, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../dashboard/styles.css";
import "./sidebar.css";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsBookFill,
} from "react-icons/bs";
import "../dashboard/dashb.css";
import Header from "../dashboard/Header";
import Sidebar from "../dashboard/Sidebar";
const ExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchExchanges();
  }, []);
  const handleOpenAddModal = () => {
    clear(); 
    setShowAddModal(true);
  };
  const fetchExchanges = async () => {
    try {
      const response = await apiService.getAllExchanges();
      console.log('Full API Response:', response);
      const allExchanges = response.data.$values;

      if (Array.isArray(allExchanges)) {
        setExchanges(allExchanges);
      } else {
        console.error('Expected an array of exchanges but received:', allExchanges);
      }
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    }
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleEdit = (exchange) => {
    setSelectedExchange(exchange);
    setShowEditModal(true);
  };

  const handleDelete = async (exchangeId) => {
    try {
      await apiService.deleteExchange(exchangeId);
      setExchanges(exchanges.filter(exchange => exchange.exchangeId !== exchangeId));
    } catch (error) {
      console.error(`Error deleting exchange with ID ${exchangeId}:`, error);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setSelectedExchange((prevExchange) => ({
      ...prevExchange,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await apiService.updateExchange(selectedExchange.exchangeId, selectedExchange);
      setShowEditModal(false);
      fetchExchanges(); 
    } catch (error) {
      console.error('Error updating exchange:', error.response ? error.response.data : error.message);
    }
  };
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const handleCustomersClick = () => {
    setShowKlienti(true);
    setShowLibri(false); 
  };

  const handleLibriClick = () => {
    setShowLibri(true);
    setShowKlienti(false); 
  };
  const handleAutoriClick = () => {
    setShowLibri(false);
    setShowKlienti(false);
    setShowAutori(true);
  };
  const handleStafiClick = () => {
    setShowLibri(false);
    setShowKlienti(false);
    setShowAutori(false);
    setShowStafi(true);
  };
  return (
    <Fragment>
    <div className="app-container">
        {/* Sidebar Container */}
        <div className={`sidebar-container ${showSidebar ? "open" : "closed"}`}>
          {/* Toggle Icon */}
          <div className="sidebar-toggle-icon-container">
            <BsThreeDotsVertical
              className="sidebar-toggle-icon"
              onClick={toggleSidebar}
            />
          </div>
  
          {/* Sidebar Component */}
          {showSidebar && <Sidebar />}
        </div>
   </div>
  
       
        <ToastContainer />
  
        <Container className="py-5">
    <div className="header-container">
      <h1 className="title">Exchanges List</h1>
    
    </div>
    <Table striped bordered hover variant="light">
          <thead className="thead-dark">
            <tr>
              <th>Klient ID</th>
              <th>Emri</th>
              <th>Email</th>
              <th>Libri ID</th>
              <th>ISBN</th>
              <th>Titulli</th>
              <th>Status</th>
              <th>Exchange Date</th>
              <th>Return Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map(exchange => (
              <tr key={exchange.exchangeId}>
                <td>{exchange.klient.klientId}</td>
                <td>{exchange.klient.emri}</td>
                <td>{exchange.klient.email}</td>
                <td>{exchange.libri.libriId}</td>
                <td>{exchange.libri.isbn}</td>
                <td>{exchange.libri.titulli}</td>
                <td>{exchange.status}</td>
                <td>{new Date(exchange.exchangeDate).toLocaleDateString()}</td>
                <td>{new Date(exchange.returnDate).toLocaleDateString()}</td>
                <td>
                  <Button variant="custom"  className="edit-button" onClick={() => handleEdit(exchange)}>Edit</Button>
                  <Button variant="custom"   className="delete-button" onClick={() => handleDelete(exchange.exchangeId)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
      

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Exchange</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExchange && (
            <Form>
              <Form.Group controlId="formKlientId">
                <Form.Label>Klient ID</Form.Label>
                <Form.Control
                  type="text"
                  name="klientId"
                  value={selectedExchange.klientId}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formLibriId">
                <Form.Label>Libri ID</Form.Label>
                <Form.Control
                  type="text"
                  name="libriId"
                  value={selectedExchange.libriId}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={selectedExchange.status}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formExchangeDate">
                <Form.Label>Exchange Date</Form.Label>
                <Form.Control
                  type="date"
                  name="exchangeDate"
                  value={new Date(selectedExchange.exchangeDate).toISOString().split('T')[0]}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formReturnDate">
                <Form.Label>Return Date</Form.Label>
                <Form.Control
                  type="date"
                  name="returnDate"
                  value={new Date(selectedExchange.returnDate).toISOString().split('T')[0]}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="custom" className="edit-button" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="custom" className="delete-button" onClick={handleEditSubmit}>Save Changes</Button>
          </Modal.Footer>
      </Modal>
      </Table>

      </Container>
  
  </Fragment>
  );
};

export default ExchangeList;
