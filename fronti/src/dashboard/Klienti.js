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
import { Buffer } from "buffer";
import process from "process";
import { Link } from "react-router-dom";
import { CgAlignCenter } from "react-icons/cg";
import "./styles.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./sidebar.css";
import "./dashb.css";
import Header from "./Header";
import Sidebar from "./Sidebar"
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
window.Buffer = Buffer;
window.process = process;

const Klienti = () => {
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [qytetiList, setQytetiList] = useState([]);
  const [selectedQyteti, setSelectedQyteti] = useState("");
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [email, setEmail] = useState("");
  const [nrPersonal, setNrPersonal] = useState("");
  const [password, setPassword] = useState("");
  const [statusi, setStatusi] = useState("");
  const [editStatusi, setEditStatusi] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adresa, setAdresa] = useState("");
  const [nrTel, setNrTel] = useState("");
  const [editId, setEditId] = useState("");
  const [editEmri, setEditEmri] = useState("");
  const [editMbiemri, setEditMbiemri] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editNrPersonal, setEditNrPersonal] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editAdresa, setEditAdresa] = useState("");
  const [editNrTel, setEditNrTel] = useState("");
  const [editSelectedQytetiID, setEditSelectedQytetiID] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editProfilePictureUrl, setEditProfilePictureUrl] = useState("");
  const [editSelectedQyteti, setEditSelectedQyteti] = useState("");
  const [role, setRole] = useState("");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  const [filteredKlientList, setFilteredKlientList] = useState([]);
  const [emriFilter, setEmriFilter] = useState("");

  const [data, setData] = useState([]);

  const handleClose = () => {
    setShow(false);
    setEditProfilePictureUrl(""); 
    setEditSelectedFile(null); 
    
  };
  const handleShow = () => setShow(true);

  const handleOpenAddModal = () => {
    clear(); 
    setShowAddModal(true);
  };
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleFileUpload = (e) => setSelectedFile(e.target.files[0]);
  const [editProfilePicturePath, setEditProfilePicturePath] = useState("");

  useEffect(() => {
    getData();
    getQytetiList();
    getUserRole();
  }, []);
  const getUserRole = () => {
    axios
      .get(`https://localhost:7101/api/Klient/with-roles`)
      .then((result) => {
        setRole(result.data.role);
      })
      .catch((error) => {
        console.error("Error fetching user role:", error);
        toast.error("Failed to fetch user role.");
      });
  };

  const getData = () => {
    axios
      .get(`https://localhost:7101/api/Klient/with-roles`)
      .then((result) => {
        const klientData = result.data?.$values;
        if (Array.isArray(klientData)) {
          setData(klientData);
          setFilteredKlientList(klientData);
        } else {
          console.error("Unexpected data format:", result.data);
          toast.error("Failed to fetch client data.");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch client data.");
      });
  };

  const getQytetiList = () => {
    axios
      .get(`https://localhost:7101/api/Qyteti`)
      .then((result) => {
        const qytetiData = result.data?.$values;
        if (Array.isArray(qytetiData)) {
          setQytetiList(qytetiData);
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
    handleShow();
    setEditProfilePictureUrl("");
    axios
      .get(`https://localhost:7101/api/Klient/${id}`)
      .then((result) => {
        const clientData = result.data;
        setEditId(clientData.id);
        setEditEmri(clientData.emri);
        setEditMbiemri(clientData.mbiemri);
        setEditNrPersonal(clientData.nrPersonal);
        setEditEmail(clientData.email);
        setEditAdresa(clientData.adresa);
        setEditStatusi(clientData.statusi);
        setEditNrTel(clientData.nrTel);
        setEditSelectedQytetiID(clientData.qytetiID);
        setEditProfilePictureUrl(clientData.profilePictureUrl);
        setEditProfilePicturePath(clientData.profilePicturePath); 

        if (clientData.password) {
          setEditPassword(clientData.password);
          setEditConfirmPassword(clientData.password);
        } else {
          setEditPassword("");
          setEditConfirmPassword("");
        }
      })
      .catch((error) => {
        console.error("Error fetching client data:", error);
        toast.error("Failed to fetch client data.");
      });
  };
  const handleUpdate = () => {
    if (editPassword !== editConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    console.log("editSelectedQytetiID:", editSelectedQytetiID);
    console.log("qytetiList:", qytetiList);
    console.log("editSelectedFile:", editSelectedFile);

    const url = `https://localhost:7101/api/Klient/${editId}`;
    const formData = new FormData();

    formData.append("emri", editEmri);
    formData.append("mbiemri", editMbiemri);
    formData.append("nrPersonal", editNrPersonal);
    formData.append("email", editEmail);
    formData.append("adresa", editAdresa);
    formData.append("statusi", editStatusi);
    formData.append("nrTel", editNrTel);
    formData.append("confirmPassword", editConfirmPassword);
    formData.append("qytetiID", editSelectedQytetiID);

    if (editSelectedFile) {
      formData.append("profilePicturePath", editSelectedFile); 
    }

    if (editPassword) {
      formData.append("password", editPassword);
    }

    axios
      .put(url, formData)
      .then((response) => {
        if (response.status === 204) {
          handleClose();
          getData();
          clear();
          toast.success("Client has been updated");
        } else {
          console.error("Unexpected response status:", response.status);
          toast.error("Failed to update client.");
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          Object.keys(errors).forEach((field) => {
            errors[field].forEach((message) => {
              toast.error(message);
            });
          });
        } else {
          console.error("Error updating client:", error);
          toast.error("Failed to update client.");
        }
      });
  };

  const handleEditFileUpload = (e) => {
    const file = e.target.files[0];
    setEditSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setEditProfilePictureUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    console.log("selectedQyteti:", selectedQyteti);
    console.log("qytetiList:", qytetiList);
    console.log("selectedFile:", selectedFile);

    const url = "https://localhost:7101/api/Klient";

    const formData = new FormData();
    formData.append("emri", emri);
    formData.append("mbiemri", mbiemri);
    formData.append("nrPersonal", nrPersonal);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("adresa", adresa);
    formData.append("nrTel", nrTel);
    formData.append("statusi", statusi);

    if (!selectedQyteti) {
      toast.error("Please select a city.");
      return;
    }

    const selectedCity = qytetiList.find(
      (qyteti) => qyteti.id === selectedQyteti
    );
    if (selectedCity) {
      formData.append("qytetiID", selectedCity.id);
      formData.append("qyteti", JSON.stringify(selectedCity));
    } else {
      toast.error("Invalid city selection.");
      return;
    }

    if (selectedFile) {
      formData.append("profilePicturePath", selectedFile); 
    }

    axios
      .post(url, formData)
      .then((result) => {
        getData();
        clear();
        toast.success("Client has been added");
        handleCloseAddModal();
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          Object.keys(errors).forEach((field) => {
            errors[field].forEach((message) => {
              toast.error(message);
            });
          });
        } else {
          console.error(
            "Failed to add client:",
            error.response || error.message
          );
          toast.error("Failed to add client. Please try again.");
        }
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
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      axios
        .delete(`https://localhost:7101/api/Klient/${id}`)
        .then((response) => {
          console.log("Delete response:", response);
          if (response.status === 204) {
            toast.success("Book has been deleted");
            const updatedList = data.filter((item) => item.id !== id);
            setData(updatedList);
            setFilteredKlientList(updatedList);
          }
        })
        .catch((error) => {
          toast.error("Failed to delete book. Please try again later.");
          console.error("Error:", error);
        });
    }
  };
  const clear = () => {
    setEmri("");
    setMbiemri("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAdresa("");
    setNrTel("");
    setStatusi("");
    setEditNrPersonal("");
    setSelectedQyteti("");
    setEditProfilePictureUrl("");
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setInStock(1);
    } else {
      setInStock(0);
    }
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditInStock(1);
    } else {
      setEditInStock(0);
    }
  };
  const handleFilterChange = (e) => {
    const { value } = e.target;
    setEmriFilter(value);
    if (value === "") {
      setFilteredKlientList(data);
    } else {
      const filteredList = data.filter((klient) =>
        klient.emri.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredKlientList(filteredList);
    }
  };

  const filterFn = (data, filterValue) => {
    if (filterValue.trim() === "") {
      setFilteredKlientList(data);
    } else {
      const filteredData = data.filter((el) => {
        return (el.emri?.toString() ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase().trim());
      });
      setFilteredKlientList(filteredData);
    }
  };
  const sortResult = (prop, asc) => {
    const sortedData = [...filteredKlientList].sort((a, b) => {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    setFilteredKlientList(sortedData);
  };
  const handleCityChange = (event) => {
    const selectedCityId = parseInt(event.target.value);
    setSelectedQyteti(selectedCityId);
  };

  const handleEditCityChange = (event) => {
    const selectedCityId = parseInt(event.target.value);
    setEditSelectedQytetiID(selectedCityId);
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleEditFileChange = (event) => {
    setEditSelectedFile(event.target.files[0]);
  };
  return (
    <div className="container">
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
      <div className="d-flex align-items-center mt-4 mb-4">
  <h1 className="text-center mx-auto flex-grow-1">Clients List</h1>
  <Button
    variant="costum"
    className="other-button"
    onClick={handleOpenAddModal}
  >
    Add Client
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
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Emri</th>
            <th>Mbiemri</th>
            <th>Nr. Personal</th>
            <th>Email</th>
            <th>Adresa</th>
            <th>Statusi</th>
            <th>Nr. Tel</th>
            <th>Password</th>
            <th>Qyteti</th>
            <th>Profili</th>
            <th>Roli</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredKlientList) &&
            filteredKlientList.map((client, index) => (
              <tr key={client.id || index}>
                <td>{index + 1}</td>
                <td>{client.emri}</td>
                <td>{client.mbiemri}</td>
                <td>{client.nrPersonal}</td>
                <td>{client.email}</td>
                <td>{client.adresa}</td>
                <td>{client.statusi}</td>
                <td>{client.nrTel}</td>
                <td>{client.password}</td>
                <td>{client.qytetiEmri}</td>
                <td>
                  {client.profilePictureUrl ? (
                    <img
                      src={client.profilePictureUrl}
                      alt="Profile"
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{client.roliName}</td>
                <td>
                  <Fragment>
                    <Button
                      variant="costum"
                      onClick={() => handleEdit(client.id)}
                      className="edit-button"
                    >
                      <BsFillPencilFill />
                    </Button>
                    <Button
                      variant="costum"
                      onClick={() => handleDelete(client.id)}
                      className="delete-button"
                    >
                      <BsFillTrashFill />
                    </Button>
                  </Fragment>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <form>
                  <div className="form-group">
                    <label htmlFor="emri">Emri</label>
                    <input
                      type="text"
                      className="form-control"
                      id="emri"
                      value={emri}
                      onChange={(e) => setEmri(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mbiemri">Mbiemri</label>
                    <input
                      type="text"
                      className="form-control"
                      id="mbiemri"
                      value={mbiemri}
                      onChange={(e) => setMbiemri(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nrPersonal">Nr. Personal</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nrPersonal"
                      value={nrPersonal}
                      onChange={(e) => setNrPersonal(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="adresa">Adresa</label>
                    <input
                      type="text"
                      className="form-control"
                      id="adresa"
                      value={adresa}
                      onChange={(e) => setAdresa(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="statusi">Statusi</label>
                    <input
                      type="text"
                      className="form-control"
                      id="statusi"
                      value={statusi}
                      onChange={(e) => setStatusi(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nrTel">Nr. Tel</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nrTel"
                      value={nrTel}
                      onChange={(e) => setNrTel(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="qyteti">Qyteti</label>
                    <select onChange={handleCityChange}>
                      <option value="">Select a city</option>
                      {qytetiList.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.emri}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Profile Picture</label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="form-control"
                    />
                  </div>
                </form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="edit-button"
            onClick={handleCloseAddModal}
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ndrysho Klientin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <form>
                  <div className="form-group">
                    <label htmlFor="editEmri">Emri</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editEmri"
                      value={editEmri}
                      onChange={(e) => setEditEmri(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editMbiemri">Mbiemri</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editMbiemri"
                      value={editMbiemri}
                      onChange={(e) => setEditMbiemri(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editNrPersonal">Nr. Personal</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editNrPersonal"
                      value={editNrPersonal}
                      onChange={(e) => setEditNrPersonal(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEmail">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="editEmail"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editAdresa">Adresa</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editAdresa"
                      value={editAdresa}
                      onChange={(e) => setEditAdresa(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editStatusi">Statusi</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editStatusi"
                      value={editStatusi}
                      onChange={(e) => setEditStatusi(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editNrTel">Nr. Tel</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editNrTel"
                      value={editNrTel}
                      onChange={(e) => setEditNrTel(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editPassword">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="editPassword"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editConfirmPassword">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="editConfirmPassword"
                      value={editConfirmPassword}
                      onChange={(e) => setEditConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editQyteti">Qyteti</label>
                    <select
                      className="form-control"
                      value={editSelectedQytetiID}
                      onChange={(e) => setEditSelectedQytetiID(e.target.value)}
                    >
                      <option value="">Select Qyteti</option>
                      {qytetiList.map((qyteti) => (
                        <option key={qyteti.id} value={qyteti.id}>
                          {qyteti.emri}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="editProfilePicturePath">
                      Profile Picture Path
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editProfilePicturePath"
                      value={editProfilePicturePath}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Profile Picture</label>
                    {editProfilePictureUrl && (
                      <div>
                        <img
                          src={editProfilePictureUrl}
                          alt="Profile Picture"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginBottom: "10px",
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleEditFileUpload}
                      className="form-control"
                    />
                  </div>
                </form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="custom"
            className="edit-button"
            onClick={handleClose}
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
    </div>
  );
};

export default Klienti;
