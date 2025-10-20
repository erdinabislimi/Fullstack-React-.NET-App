import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table, Button, Modal, Row, Col, Container, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "./styles.css";

const Payments = () => {
  const [paymentList, setPaymentList] = useState([]);
  const [filteredPaymentList, setFilteredPaymentList] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]); 
  // Fields for Add/Edit forms
  const [paymentId, setPaymentId] = useState("");
  const [klientId, setKlientId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [exchangeId, setExchangeId] = useState("");
  const [editId, setEditId] = useState("");
    const [klientiList, setKlientiList] = useState([]);
  

  const [amountFilter, setAmountFilter] = useState("");

  useEffect(() => {
    getPaymentsData();
    getKlienti();
  }, []);
  const getPaymentsData = () => {
    axios
      .get(`https://localhost:7101/api/Payment`)
      .then((result) => {
        console.log("API Response:", result.data); 
        const paymentData = result.data?.$values; 
  
        if (!Array.isArray(paymentData)) {
          console.error("Unexpected data format:", result.data);
          toast.error("Failed to fetch payment data.");
          return;
        }
  
        const formattedData = paymentData.map((payment) => ({
          ...payment,
          paymentDate: formatDate(payment.paymentDate),
          validUntil: formatDate(payment.validUntil),
        }));
  
        setData(formattedData);
        setPaymentList(formattedData); 
        setFilteredPaymentList(formattedData);
      })
      .catch((error) => {
        console.error("Failed to fetch payments:", error);
        toast.error("Failed to fetch payment data.");
      });
  };
  
  
  const extractArray = (data) => {
    return Array.isArray(data) ? data : [];
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date) ? "Invalid Date" : date.toLocaleDateString(); 
    } catch (error) {
      console.error("Invalid date string:", dateString);
      return "Invalid Date";
    }
  };
  const getKlienti = () => {
    axios
      .get(`https://localhost:7101/api/Klient`)
      .then((result) => {
        const KlientData = result.data?.$values;
        if (Array.isArray(KlientData)) {
          setKlientiList(KlientData);
        } else {
          console.error("Unexpected data format:", result.data);
          toast.error("Failed to fetch city data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
        toast.error("Failed to fetch city data.");
      });
  };

  const handleEdit = (id) => {
    setShow(true);
    axios
      .get(`https://localhost:7101/api/Payment/${id}`)
      .then((result) => {
        const paymentData = result.data?.$values ? result.data.$values[0] : result.data;
  
        if (paymentData) {
          setPaymentId(paymentData.PaymentId);
          setKlientId(paymentData.KlientId);
          setAmount(paymentData.Amount);
          setPaymentStatus(paymentData.PaymentStatus);
          setPaymentDate(paymentData.PaymentDate);
          setValidUntil(paymentData.ValidUntil);
          setExchangeId(paymentData.ExchangeId);
          setEditId(paymentId);
        } else {
          toast.error("Failed to fetch valid data for editing.");
        }
      })
      .catch((error) => {
        console.error("Error fetching payment:", error);
        toast.error("Failed to fetch payment data.");
      });
  };
  
  

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      axios
        .delete(`https://localhost:7101/api/Payment/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Payment has been deleted");
            const updatedList = paymentList.filter((item) => item.PaymentId !== id);
            setPaymentList(updatedList);
            setFilteredPaymentList(updatedList);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete data");
        });
    }
  };

  const handleUpdate = () => {
    if (!klientId || !amount || !paymentStatus || !paymentDate || !validUntil || !exchangeId) {
      toast.error("Please fill all fields");
      return;
    }

    const url =` https://localhost:7101/api/Payment/${editId}`;
    const data = {
      PaymentId: paymentId,
      KlientId: klientId,
      Amount: amount,
      PaymentStatus: paymentStatus,
      PaymentDate: paymentDate,
      ValidUntil: validUntil,
      ExchangeId: exchangeId,
    };
    axios
      .put(url, data)
      .then(() => {
        setShow(false);
        fetchPaymentList();
        toast.success("Payment has been updated");
      })
      
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update data");
      });
  };

  const handleSave = () => {
    if (!klientId || !amount || !paymentStatus || !paymentDate || !validUntil || !exchangeId) {
      toast.error("Please fill all fields");
      return;
    }

    const url = "https://localhost:7101/api/Payment";
    const data = {
      KlientId: klientId,
      Amount: amount,
      PaymentStatus: paymentStatus,
      PaymentDate: paymentDate,
      ValidUntil: validUntil,
      ExchangeId: exchangeId,
    };
    axios
      .post(url, data)
      .then(() => {
        fetchPaymentList();
        toast.success("Payment has been added");
        setShowAddModal(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to save data");
      });
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setAmountFilter(value);
    filterFn(value);
  };

  const filterFn = (filterValue) => {
    if (filterValue.trim() === "") {
      setFilteredPaymentList(paymentList);
    } else {
      const filteredData = paymentList.filter((el) =>
        (el.Amount?.toString() ?? "").toLowerCase().includes(filterValue.toLowerCase().trim())
      );
      setFilteredPaymentList(filteredData);
    }
  };
  return (
    <Fragment>
      <ToastContainer />
      <Container className="py-5">
        <h1 className="title">Payments List</h1>
  
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Client ID</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Payment Date</th>
              <th>Valid Until</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredPaymentList) && filteredPaymentList.length > 0 ? (
              filteredPaymentList.map((item, key) => (
                <tr key={key}>
                  <td>{item.paymentId}</td>
                  <td>{item.klientId}</td>
                  <td>{item.amount}</td>
                  <td>{item.paymentStatus}</td>
                  <td>{item.paymentDate}</td>
                  <td>{item.validUntil}</td>
                  <td>
                    <Button
                      className="mr-2 edit-button"
                      variant="custom"
                      onClick={() => handleEdit(item.paymentId)}
                    >
                      <BsFillPencilFill />
                    </Button>
                    <Button
                      className="mr-2 delete-button"
                      variant="custom"
                      onClick={() => handleDelete(item.paymentId)}
                    >
                      <BsFillTrashFill />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
  
        {/* Edit Modal */}
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <label>Client ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={klientId}
                  onChange={(e) => setKlientId(e.target.value)}
                />
              </Col>
              <Col>
                <label>Amount</label>
                <input
                  type="text"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Payment Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                />
              </Col>
              <Col>
                <label>Payment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Valid Until</label>
                <input
                  type="date"
                  className="form-control"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </Col>
              <Col>
                <label>Exchange ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={exchangeId}
                  onChange={(e) => setExchangeId(e.target.value)}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="custom" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
  
        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <select
                  className="form-control mb-2"
                  onChange={(e) => {
                    const selectedKlient = klientiList.find(
                      (klient) => klient.id === parseInt(e.target.value)
                    );
                    setKlientID(selectedKlient?.id || "");
                    setKlientName(selectedKlient?.emri || "");
                  }}
                >
                  <option value="">Select Klient</option>
                  {klientiList.map((klient) => (
                    <option key={klient.klientID} value={klient.id}>
                      {klient.emri}
                    </option>
                  ))}
                </select>
              </Col>
              <Col>
                <label>Amount</label>
                <input
                  type="text"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Payment Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                />
              </Col>
              <Col>
                <label>Payment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Valid Until</label>
                <input
                  type="date"
                  className="form-control"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </Col>
              <Col>
                <label>Exchange ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={exchangeId}
                  onChange={(e) => setExchangeId(e.target.value)}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="custom" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Add Payment
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
}  
export default Payments;