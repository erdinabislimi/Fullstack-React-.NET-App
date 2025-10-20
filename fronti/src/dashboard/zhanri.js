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

const Zhanri = () => {
  const [zhanriList, setZhanriList] = useState([]);
  const [filteredZhanriList, setFilteredZhanriList] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [emri, setEmri] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState("");
  const [editEmri, setEditEmri] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [emriFilter, setEmriFilter] = useState("");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    fetchZhanriList();
  }, []);
  const handleOpenAddModal = () => {
    clear(); 
    setShowAddModal(true);
  };
  const fetchZhanriList = () => {
    axios
      .get(`https://localhost:7101/api/Zhanri`)
      .then((result) => {
        console.log("API Response:", result.data); 
        if (Array.isArray(result.data)) {
          setZhanriList(result.data);
          setFilteredZhanriList(result.data);
        } else if (result.data.$values) {
          setZhanriList(result.data.$values);
          setFilteredZhanriList(result.data.$values);
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
      .get(`https://localhost:7101/api/Zhanri/${id}`)
      .then((result) => {
        setEditEmri(result.data.emri);
        setEditDescription(result.data.description);
        setEditId(id);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch data");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this genre?")) {
      axios
        .delete(`https://localhost:7101/api/Zhanri/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Genre has been deleted");
            const updatedList = zhanriList.filter(
              (item) => item.zhanriId !== id
            );
            setZhanriList(updatedList);
            setFilteredZhanriList(updatedList);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete data");
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7101/api/Zhanri/${editId}`;
    const data = {
      zhanriId: editId,
      emri: editEmri,
      description: editDescription,
    };
    axios
      .put(url, data)
      .then((result) => {
        setShow(false);
        fetchZhanriList();
        clear();
        toast.success("Genre has been updated");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update data");
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7101/api/Zhanri";
    const data = { emri: emri, description: description };
    axios
      .post(url, data)
      .then((result) => {
        fetchZhanriList();
        clear();
        toast.success("Genre has been added");
        setShowAddModal(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to save data");
      });
  };

  const clear = () => {
    setEmri("");
    setDescription("");
    setEditEmri("");
    setEditDescription("");
    setEditId("");
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

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setEmriFilter(value);
    filterFn(value);
  };

  const filterFn = (filterValue) => {
    if (filterValue.trim() === "") {
      setFilteredZhanriList(zhanriList);
    } else {
      const filteredData = zhanriList.filter((el) => {
        return (el.emri?.toString() ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase().trim());
      });
      setFilteredZhanriList(filteredData);
    }
  };

  const sortResult = (prop, asc) => {
    const sortedData = [...filteredZhanriList].sort((a, b) => {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    setFilteredZhanriList(sortedData);
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
      <h1 className="title">Genres List</h1>
      <Button
        variant="costum"
        className="other-button"
        onClick={handleOpenAddModal}
      >
        Add Genre
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
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredZhanriList) &&
            filteredZhanriList.length > 0 ? (
              filteredZhanriList.map((item, key) => (
                <tr key={key}>
                  <td>{item.zhanriId}</td>
                  <td>{item.emri}</td>
                  <td>{item.description}</td>
                  <td>
                    <Button
                      variant="custom"
                      onClick={() => handleEdit(item.zhanriId)}
                      className="mr-2 edit-button"
                    >
                      <BsFillPencilFill />
                    </Button>
                    <Button
                      variant="custom"
                      onClick={() => handleDelete(item.zhanriId)}
                      className="mr-2 delete-button"
                    >
                      <BsFillTrashFill />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Genre</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <label>Name</label>
                <input
                  type="text"
                  value={editEmri}
                  onChange={(e) => setEditEmri(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Description</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="form-control"
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
            <Modal.Title>Add New Genre</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <label>Name</label>
                <input
                  type="text"
                  value={emri}
                  onChange={(e) => setEmri(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
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

export default Zhanri;
