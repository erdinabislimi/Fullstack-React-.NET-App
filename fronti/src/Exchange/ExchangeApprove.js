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
const ExchangeApprove = () => {
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    fetchPendingExchanges();
  }, []);
  const handleOpenAddModal = () => {
    clear(); 
    setShowAddModal(true);
  };
  const fetchPendingExchanges = async () => {
    try {
      const response = await apiService.getAllExchanges();
      const allExchanges = response.data.$values;

      if (Array.isArray(allExchanges)) {
        const pendingExchanges = allExchanges.filter(
          (exchange) => exchange.status === "Pending Approval"
        );
        setExchanges(pendingExchanges);
      } else {
        console.error(
          "Expected an array of exchanges but received:",
          allExchanges
        );
      }
    } catch (error) {
      console.error("Error fetching pending approval exchanges:", error);
    }
  };

  const handleApproveClick = (exchangeId) => {
    const selected = exchanges.find(
      (exchange) => exchange.exchangeId === exchangeId
    );
    setSelectedExchange(selected);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExchange(null);
  };

  const handleApproveExchange = async () => {
    try {
      await apiService.approveExchange(selectedExchange.exchangeId);
      fetchPendingExchanges(); // Refresh the list after approval
      handleCloseModal();
    } catch (error) {
      console.error("Error approving exchange:", error);
    }
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleDelete = async (exchangeId) => {
    try {
      await apiService.deleteExchange(exchangeId);
      setExchanges(
        exchanges.filter((exchange) => exchange.exchangeId !== exchangeId)
      );
    } catch (error) {
      console.error(`Error deleting exchange with ID ${exchangeId}:`, error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedExchange((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      <h1 className="title">ExchangeApprove List</h1>
    
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
            {exchanges.map((exchange) => (
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
                  <Button
                    className="mr-2 edit-button"
                    variant="custom"
                    onClick={() => handleApproveClick(exchange.exchangeId)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="mr-3 delete-button"
                    variant="custom"
                    onClick={() => handleDelete(exchange.exchangeId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
      
    

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Exchange</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to approve this exchange?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="custom" className="delete-button" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="custom" className="edit-button" onClick={handleApproveExchange}>
            Approve Exchange
          </Button>
        </Modal.Footer>
      </Modal>
      </Table>

      </Container>
  
  </Fragment>
  );
};

export default ExchangeApprove;
