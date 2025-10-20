import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table, Button, Modal, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./styles.css";
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
import "./dashb.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
const Qyteti = () => {
  const [qytetiList, setQytetiList] = useState([]);
  const [filteredQytetiList, setFilteredQytetiList] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [emri, setEmri] = useState("");
  const [editId, setEditId] = useState("");
  const [editEmri, setEditEmri] = useState("");
  const [emriFilter, setEmriFilter] = useState("");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    fetchQytetiList();
  }, []);
  const handleOpenAddModal = () => {
    clear(); 
    setShowAddModal(true);
  };
  const fetchQytetiList = () => {
    axios
      .get(`https://localhost:7101/api/Qyteti`)
      .then((result) => {
        console.log("API Response:", result.data); 
        if (Array.isArray(result.data)) {
          setQytetiList(result.data);
          setFilteredQytetiList(result.data);
        } else if (result.data.$values) {
          setQytetiList(result.data.$values);
          setFilteredQytetiList(result.data.$values);
        } else {
          console.error("Unexpected data format:", result.data);
          toast.error("Unexpected data format");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch data");
      });
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleEdit = (id) => {
    setShow(true);
    axios
      .get(`https://localhost:7101/api/Qyteti/${id}`)
      .then((result) => {
        setEditEmri(result.data.emri);
        setEditId(id);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch data");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this qyteti?")) {
      axios
        .delete(`https://localhost:7101/api/Qyteti/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Qyteti has been deleted");
            const updatedList = qytetiList.filter((item) => item.id !== id);
            setQytetiList(updatedList);
            setFilteredQytetiList(updatedList);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete data");
        });
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

  const handleUpdate = () => {
    const url = `https://localhost:7101/api/Qyteti/${editId}`;
    const data = { id: editId, emri: editEmri };
    axios
      .put(url, data)
      .then((result) => {
        setShow(false);
        fetchQytetiList();
        clear();
        toast.success("Qyteti has been updated");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update data");
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7101/api/Qyteti";
    const data = { emri: emri };
    axios
      .post(url, data)
      .then((result) => {
        fetchQytetiList();
        clear();
        toast.success("Qyteti has been added");
        setShowAddModal(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to save data");
      });
  };

  const clear = () => {
    setEmri("");
    setEditEmri("");
    setEditId("");
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setEmriFilter(value);
    filterFn(value);
  };

  const filterFn = (filterValue) => {
    if (filterValue.trim() === "") {
      setFilteredQytetiList(qytetiList);
    } else {
      const filteredData = qytetiList.filter((el) => {
        return (el.emri?.toString() ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase().trim());
      });
      setFilteredQytetiList(filteredData);
    }
  };

  const sortResult = (prop, asc) => {
    const sortedData = [...filteredQytetiList].sort((a, b) => {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    setFilteredQytetiList(sortedData);
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
      <h1 className="title">Cities List</h1>
      <Button
        variant="costum"
        className="other-button"
        onClick={handleOpenAddModal}
      >
        Add City
      </Button>
    </div>
  
  
  
        <div className="ml-auto d-flex">
          <input
            className="form-control m-2"
            value={emriFilter}
            onChange={handleFilterChange}
            placeholder="Filter by Emri"
          />
          
         
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>
                Emri
                <Button variant="link" onClick={() => sortResult("emri", true)}>
                  Asc
                </Button>
                <Button
                  variant="link"
                  onClick={() => sortResult("emri", false)}
                >
                  Desc
                </Button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredQytetiList) &&
              filteredQytetiList.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.emri}</td>
                  <td>
                    <Button
                      variant="custom"
                      onClick={() => handleEdit(item.id)}
                      className="mr-2 edit-button"
                    >
                      <BsFillPencilFill />
                    </Button>
                    <Button
                      variant="custom"
                      onClick={() => handleDelete(item.id)}
                      className="delete-button"
                    >
                      <BsFillTrashFill />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
  

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Qyteti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label>Emri</label>
              <input
                type="text"
                className="form-control"
                value={editEmri}
                onChange={(e) => setEditEmri(e.target.value)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="edit-button"
            onClick={() => setShow(false)}
          >
            Close
          </Button>
          <Button
            variant="custom"
            className="delete-button"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Qyteti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label>Emri</label>
              <input
                type="text"
                className="form-control"
                value={emri}
                onChange={(e) => setEmri(e.target.value)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="edit-button"
            onClick={() => setShowAddModal(false)}
          >
            Close
          </Button>
          <Button
            variant="custom"
            className="delete-button"
            onClick={handleSave}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </Fragment>
  );
};

export default Qyteti;
