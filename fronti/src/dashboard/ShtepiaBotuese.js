import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
const Shtepia = () => {
  const [shtepiaList, setShtepiaList] = useState([]);
  const [filteredShtepiaList, setFilteredShtepiaList] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [emri, setEmri] = useState("");
  const [adresa, setAdresa] = useState("");
  const [editIdShB, setEditIdShB] = useState("");
  const [editEmri, setEditEmri] = useState("");
  const [editAdresa, setEditAdresa] = useState("");

  const [emriFilter, setEmriFilter] = useState("");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchShtepiaList();
  }, []);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleOpenAddModal = () => {
    clear(); 
    setShowAddModal(true);
  };
  const fetchShtepiaList = () => {
    axios
      .get(`https://localhost:7101/api/ShtepiaBotuese`)
      .then((result) => {
        console.log("API Response:", result.data); 
        if (Array.isArray(result.data)) {
          setShtepiaList(result.data);
          setFilteredShtepiaList(result.data);
        } else if (result.data.$values) {
          setShtepiaList(result.data.$values);
          setFilteredShtepiaList(result.data.$values);
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
  const handleEdit = (shtepiaBotueseID) => {
    setShow(true);
    axios
      .get(`https://localhost:7101/api/ShtepiaBotuese/${shtepiaBotueseID}`)
      .then((result) => {
        setEditEmri(result.data.emri);
        setEditAdresa(result.data.adresa);
        setEditIdShB(shtepiaBotueseID);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (shtepiaBotueseID) => {
    if (window.confirm("Are you sure to delete this publishing house?")) {
      axios
        .delete(`https://localhost:7101/api/ShtepiaBotuese/${shtepiaBotueseID}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("ShtepiaBotuese has been deleted");
            const updatedList = shtepiaList.filter(
              (item) => item.shtepiaBotueseID !== shtepiaBotueseID
            );
            setShtepiaList(updatedList);
            setFilteredShtepiaList(updatedList);
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7101/api/ShtepiaBotuese/${editIdShB}`;
    const data = {
      shtepiaBotueseID: editIdShB,
      emri: editEmri,
      adresa: editAdresa,
    };
    axios
      .put(url, data)
      .then((result) => {
        setShow(false);
        fetchShtepiaList();
        clear();
        toast.success("ShtepiaBotuese has been updated");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    const url = `https://localhost:7101/api/ShtepiaBotuese`;

   
    if (!emri || !adresa) {
      toast.error("Please fill in all required fields.");
      return;
    }

  
    if (typeof emri !== "string" || typeof adresa !== "string") {
      toast.error("Fields must be strings.");
      return;
    }

    if (!isNaN(emri) || !isNaN(adresa)) {
      toast.error("Fields must be valid strings, not numbers.");
      return;
    }

    const newData = {
      emri: emri,
      adresa: adresa,
    };

    axios
      .post(url, newData)
      .then((result) => {
        fetchShtepiaList();
        clear();
        toast.success("Publishing house has been added");
      })
      .catch((error) => {
        toast.error("Failed to add publishing house. Please try again.");
      });
  };

  const clear = () => {
    setEmri("");
    setAdresa("");
    setEditEmri("");
    setEditAdresa("");
    setEditIdShB("");
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setEmriFilter(value);
    filterFn(value);
  };

  const filterFn = (filterValue) => {
    if (filterValue.trim() === "") {
      setFilteredShtepiaList(shtepiaList);
    } else {
      const filteredData = shtepiaList.filter((el) => {
        return (el.emri?.toString() ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase().trim());
      });
      setFilteredShtepiaList(filteredData);
    }
  };

  const sortResult = (prop, asc) => {
    const sortedData = [...filteredShtepiaList].sort((a, b) => {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    setFilteredShtepiaList(sortedData);
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
      <h1 className="title">Publishing Houses List</h1>
      <Button
        variant="costum"
        className="other-button"
        onClick={handleOpenAddModal}
      >
        Add Publishing House
      </Button>
    </div>
        
      
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Adresa</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredShtepiaList) &&
            filteredShtepiaList.length > 0 ? (
              filteredShtepiaList.map((item, key) => (
                <tr key={key}>
                  <td>{item.shtepiaBotueseID}</td>
                  <td>{item.emri}</td>
                  <td>{item.adresa}</td>
                  <td>
                    <Button
                      className="mr-2 edit-button"
                      variant="custom"
                      onClick={() => handleEdit(item.shtepiaBotueseID)}
                    >
                      <BsFillPencilFill />
                    </Button>
                    <Button
                      className="mr-2 delete-button"
                      variant="custom"
                      onClick={() => handleDelete(item.shtepiaBotueseID)}
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
            <Modal.Title>Edit Publishing House</Modal.Title>
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
                <label>Address</label>
                <input
                  type="text"
                  value={editAdresa}
                  onChange={(e) => setEditAdresa(e.target.value)}
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
            <Modal.Title>Add New ShtepiaBotuese</Modal.Title>
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
                <label>Address</label>
                <input
                  type="text"
                  value={adresa}
                  onChange={(e) => setAdresa(e.target.value)}
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

export default Shtepia;
