
import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import Select from "react-select";
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
import { BsThreeDotsVertical } from "react-icons/bs";
import "./styles.css";
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

window.Buffer = Buffer;
window.process = process;

const Libri = () => {
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuthorsModal, setShowAuthorsModal] = useState(false);

  const [shtepiaList, setShtepiaList] = useState([]);
  const [zhanriList, setZhanriList] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);

  const [selectedShtepia, setSelectedShtepia] = useState("");
  const [selectedZhanri, setSelectedZhanri] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const [isbn, setIsbn] = useState("");
  const [titulli, setTitulli] = useState("");
  const [vitiPublikimit, setVitiPublikimit] = useState("");
  const [nrFaqeve, setNrFaqeve] = useState("");
  const [nrKopjeve, setNrKopjeve] = useState("");
  const [gjuha, setGjuha] = useState("");
  const [inStock, setInStock] = useState(0);
  const [description, setDescriptioni] = useState("");
  const [selectedAuthorsForNewBook, setSelectedAuthorsForNewBook] = useState([]);

  const [editId, setEditId] = useState("");
  const [editIsbn, setEditIsbn] = useState("");
  const [editTitulli, setEditTitulli] = useState("");
  const [editVitiPublikimit, setEditVitiPublikimit] = useState("");
  const [editNrFaqeve, setEditNrFaqeve] = useState("");
  const [editNrKopjeve, setEditNrKopjeve] = useState("");
  const [editGjuha, setEditGjuha] = useState("");
  const [editInStock, setEditInStock] = useState(0);
  const [editDescriptioni, setEditDescriptioni] = useState("");
  const [editSelectedShtepiaID, setEditSelectedShtepiaID] = useState("");
  const [editSelectedZhanriID, setEditSelectedZhanriID] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editProfilePictureUrl, setEditProfilePictureUrl] = useState("");
  const [editSelectedAuthors, setEditSelectedAuthors] = useState([]);
  const [editProfilePicturePath, setEditProfilePicturePath] = useState(""); 

  const [data, setData] = useState([]);
  const [filteredLibriList, setFilteredLibriList] = useState([]);
  const [titulliFilter, setTitulliFilter] = useState("");

  const [showSidebar, setShowSidebar] = useState(false);

  // Pagination
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLibriList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLibriList.length / itemsPerPage);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const extractArray = (data) => {
    if (data && Array.isArray(data.$values)) {
      return data.$values;
    }
    return data;
  };

  useEffect(() => {
    getData();
    getShtepiaList();
    getZhanriList();
    getAllAuthors();
  }, []);

 
  const getData = () => {
    axios
      .get(`https://localhost:7101/api/Libri`)
      .then((result) => {
        const libridata = extractArray(result.data);
        if (!Array.isArray(libridata)) {
          console.error("Unexpected data format:", result.data);
          toast.error("Failed to fetch book data.");
          return;
        }
        setData(libridata);
        setFilteredLibriList(libridata);
      })
      .catch((error) => {
        console.error("Failed to fetch books:", error);
        toast.error("Failed to fetch book data.");
      });
  };

 
  const getShtepiaList = () => {
    axios
      .get(`https://localhost:7101/api/ShtepiaBotuese`)
      .then((result) => {
        const shtepiaData = extractArray(result.data);
        if (!Array.isArray(shtepiaData)) {
          console.error("Unexpected data format:", result.data);
          toast.error("Failed to fetch publisher data.");
          return;
        }
        setShtepiaList(shtepiaData);
      })
      .catch((error) => {
        toast.error("Failed to fetch publisher data.");
      });
  };

  
  const getZhanriList = () => {
    axios
      .get(`https://localhost:7101/api/Zhanri`)
      .then((result) => {
        const zhanriData = extractArray(result.data);
        if (!Array.isArray(zhanriData)) {
          console.error("Unexpected data format:", result.data);
          toast.error("Failed to fetch genre data.");
          return;
        }
        setZhanriList(zhanriData);
      })
      .catch((error) => {
        console.error("Failed to fetch genre data:", error);
        toast.error("Failed to fetch genre data.");
      });
  };

  
  const getAllAuthors = () => {
    axios
      .get("https://localhost:7101/api/Autori/getAll")
      .then((result) => {
        const autoriData = extractArray(result.data);
        if (!Array.isArray(autoriData)) {
          console.error("Unexpected data format:", result.data);
          toast.error("Failed to fetch authors data.");
          return;
        }
        setAllAuthors(autoriData);
      })
      .catch((error) => {
        console.error("Failed to fetch authors data:", error);
        toast.error("Failed to fetch authors data.");
      });
  };
 
  const handleEdit = async (id) => {
    try {
      const { data: bookData } = await axios.get(`https://localhost:7101/api/Libri/${id}`);
      const { data: authorsData } = await axios.get(`https://localhost:7101/api/Libri/getAutoret/${id}`);
  
      setEditId(bookData.id);
      setEditIsbn(bookData.isbn);
      setEditTitulli(bookData.titulli);
      setEditVitiPublikimit(bookData.vitiPublikimit);
      setEditNrFaqeve(bookData.nrFaqeve);
      setEditNrKopjeve(bookData.nrKopjeve);
      setEditGjuha(bookData.gjuha);
      setEditInStock(bookData.inStock === 1);
      setEditDescriptioni(bookData.description);
      setEditSelectedShtepiaID(bookData.shtepiaBotueseID);
      setEditSelectedZhanriID(bookData.zhanriId);
      setEditProfilePictureUrl(bookData.profilePictureUrl || "");
      setEditProfilePicturePath(bookData.profilePicturePath || "");
  
      const mappedAuthors = authorsData.$values.map((author) => ({
        value: author.autori_ID, 
        label: author.emri, 
      }));
  
      setEditSelectedAuthors(mappedAuthors);
  
      handleShow();
    } catch (error) {
      console.error("Error in handleEdit:", error);
      toast.error("Failed to fetch book details. Please try again.");
    }
  };
  
  const handleEditFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const fetchAuthorsForBook = async (id) => {
    try {
        const response = await axios.get(`https://localhost:7101/api/Libri/getAutoret/${id}`);
        const authorsArray = response.data?.$values || [];

        console.log("Fetched authors from API:", authorsArray);

        const mappedAuthors = authorsArray.map((author) => ({
            value: author.id, 
            label: author.emri, 
        }));

        console.log("Mapped authors for React-Select:", mappedAuthors);

        setEditSelectedAuthors(mappedAuthors);
    } catch (error) {
        console.error("Error fetching authors:", error);
        toast.error("Failed to fetch authors for the book.");
    }
};
const handleUpdate = async () => {
  if (editSelectedAuthors.length === 0) {
    toast.error("Please select at least one valid author.");
    return;
  }

  const url = `https://localhost:7101/api/Libri/${editId}`;
  const formData = new FormData();

  formData.append("Isbn", editIsbn);
  formData.append("Titulli", editTitulli);
  formData.append("VitiPublikimit", editVitiPublikimit);
  formData.append("NrFaqeve", editNrFaqeve);
  formData.append("NrKopjeve", editNrKopjeve);
  formData.append("Gjuha", editGjuha);
  formData.append("InStock", editInStock ? 1 : 0);
  formData.append("Description", editDescriptioni);
  formData.append("ShtepiaBotueseID", editSelectedShtepiaID);
  formData.append("zhanriId", editSelectedZhanriID);

  if (editSelectedFile) {
    formData.append("profilePicture", editSelectedFile);
  } else if (editProfilePicturePath) {
    formData.append("profilePicturePath", editProfilePicturePath);
  }

  try {
    await axios.put(url, formData);

    await handleUpdateAuthors(editId, editSelectedAuthors);

    getData(); 
    handleClose(); 
    toast.success("Book updated successfully.");
  } catch (error) {
    console.error("Error updating book:", error.response || error);
    toast.error("Failed to update book.");
  }
};
const handleUpdateAuthors = async (bookId, selectedAuthors) => {
  const authorIds = selectedAuthors
    .filter((author) => author?.value) 
    .map((author) => author.value); 

  if (!authorIds.length) {
    toast.error("Please select at least one valid author.");
    return;
  }

  try {
    const { data: currentAuthors } = await axios.get(
      `https://localhost:7101/api/Libri/getAutoret/${bookId}`
    );

    const currentAuthorIds = (currentAuthors.$values || []).map((a) => a.autori_ID);

    const authorsToAdd = authorIds.filter((id) => !currentAuthorIds.includes(id));
    const authorsToRemove = currentAuthorIds.filter((id) => !authorIds.includes(id));

    for (const id of authorsToRemove) {
      await axios.delete(`https://localhost:7101/api/Libri/${bookId}/delete/${id}`);
    }

    for (const id of authorsToAdd) {
      await axios.post(`https://localhost:7101/api/Libri/${bookId}/ShtoAutorin/${id}`);
    }

    toast.success("Authors updated successfully.");
  } catch (error) {
    console.error("Error updating authors:", error.response || error);
    toast.error("Failed to update authors.");
  }
};
const handleSave = async () => {
  const url = "https://localhost:7101/api/Libri";

  
  if (
    !isbn ||
    !titulli ||
    !vitiPublikimit ||
    !nrFaqeve ||
    !nrKopjeve ||
    !gjuha ||
    !selectedShtepia ||
    !selectedZhanri
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }

  if (!selectedAuthorsForNewBook || selectedAuthorsForNewBook.length === 0) {
    toast.error("Please select at least one valid author.");
    return;
  }

  if (isNaN(nrFaqeve) || isNaN(nrKopjeve)) {
    toast.error("Number of pages and copies must be numeric.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("isbn", isbn);
    formData.append("titulli", titulli);
    formData.append("vitiPublikimit", vitiPublikimit);
    formData.append("nrFaqeve", nrFaqeve);
    formData.append("nrKopjeve", nrKopjeve);
    formData.append("gjuha", gjuha);
    formData.append("inStock", inStock);
    formData.append("description", description);
    formData.append("shtepiaBotueseID", selectedShtepia);
    formData.append("zhanriID", selectedZhanri);
    formData.append("profilePicture", selectedFile);
    const { data: savedBook } = await axios.post(url, formData);

    if (!savedBook.id) {
      throw new Error("Book ID is not defined in the response");
    }
    const authorPromises = selectedAuthorsForNewBook.map((author) =>
      addAuthorToBook(savedBook.id, author.value)
    );

    await Promise.all(authorPromises);

    getData(); 
    clear();
    handleCloseAddModal();
    toast.success("Book has been added.");
  } catch (error) {
    console.error("Failed to add book:", error);
    toast.error("Failed to add book. Please try again.");
  }
};

const addAuthorToBook = (bookId, authorId) => {
  return axios.post(`https://localhost:7101/api/Libri/${bookId}/ShtoAutorin/${authorId}`);
};


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axios
        .delete(`https://localhost:7101/api/Libri/${id}`)
        .then((response) => {
          if (response.status === 204) {
            toast.success("Book has been deleted");
            const updatedList = data.filter((item) => item.id !== id);
            setData(updatedList);
            setFilteredLibriList(updatedList);
          }
        })
        .catch((error) => {
          toast.error("Failed to delete book. Please try again later.");
          console.error("Error:", error);
        });
    }
  };

  const handleAuthorSelection = (selectedOptions) => {
    setSelectedAuthorsForNewBook(selectedOptions);
  };
  const handleEditAuthorSelection = (selectedOptions) => {
    setEditSelectedAuthors(selectedOptions);
  };

  const clear = () => {
    setIsbn("");
    setTitulli("");
    setVitiPublikimit("");
    setNrFaqeve("");
    setNrKopjeve("");
    setGjuha("");
    setInStock(0);
    setDescriptioni("");
    setSelectedShtepia("");
    setSelectedZhanri("");
    setSelectedFile(null);
    setSelectedAuthorsForNewBook([]);
    setEditSelectedFile(null);
    setEditSelectedAuthors([]);
    setEditProfilePictureUrl("");
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setTitulliFilter(value);
    filterFn(data, value);
  };

  const filterFn = (data, filterValue) => {
    if (filterValue.trim() === "") {
      setFilteredLibriList(data || []);
    } else {
      const filteredData = (data || []).filter((el) => {
        return (el.titulli || "").toLowerCase().includes(filterValue.toLowerCase().trim());
      });
      setFilteredLibriList(filteredData);
    }
  };


  useEffect(() => {
    setFilteredLibriList(
      (data || []).filter((item) =>
        (item.titulli || "").toLowerCase().includes(titulliFilter.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [titulliFilter, data]);

  return (
    <Fragment>
      <div className="sidebar-container">
        <div className="sidebar-toggle-icon-container">
          <BsThreeDotsVertical className="sidebar-toggle-icon" onClick={toggleSidebar} />
        </div>
        {showSidebar && <Sidebar />}
      </div>

      <ToastContainer />

      <Container className="py-5">
        <div className="header-container">
          <h1 className="title">Book List</h1>
          <Button variant="costum" className="other-button" onClick={handleOpenAddModal}>
            Add New Book
          </Button>
        </div>

        <div className="ml-auto d-flex">
          <input
            className="form-control m-2"
            value={titulliFilter}
            onChange={handleFilterChange}
            placeholder="Filter by Titulli"
          />
        </div>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>ISBN</th>
              <th>Title</th>
              <th>Publication Year</th>
              <th>Pages</th>
              <th>Copies</th>
              <th>Language</th>
              <th>Publisher</th>
              <th>Authors (Emri, Mbiemri, Nofka)</th>
              <th>Genre</th>
              <th>In Stock</th>
              <th>Description</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentItems) &&
              currentItems.map((item, index) => {
                const authorsArr = extractArray(item.autoret) || [];
                const authorsText = authorsArr.length
                  ? authorsArr.map((a) => `${a.emri} ${a.mbiemri} (${a.nofka})`).join(", ")
                  : "No Authors";

                const genreText = item.zhanri && item.zhanri.emri ? item.zhanri.emri : "No Genre";
                const inStockText = item.inStock ? "Yes" : "No";

                return (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td>{item.isbn || ""}</td>
                    <td>{item.titulli || ""}</td>
                    <td>{item.vitiPublikimit || ""}</td>
                    <td>{item.nrFaqeve || ""}</td>
                    <td>{item.nrKopjeve || ""}</td>
                    <td>{item.gjuha || ""}</td>
                    <td>{item.shtepiaBotueseID || ""}</td>
                    <td>{authorsText}</td>
                    <td>{genreText}</td>
                    <td>{inStockText}</td>
                    <td>{item.description || ""}</td>
                    <td>
                      {item.profilePicturePath ? (
                        <img
                          src={item.profilePictureUrl}
                          alt="Book Cover"
                          style={{ width: "100px", height: "100px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <Button
                        className="mr-2 edit-button"
                        variant="costum"
                        onClick={() => handleEdit(item.id)}
                      >
                        <BsFillPencilFill />
                      </Button>
                      <Button
                        variant="costum"
                        onClick={() => handleDelete(item.id)}
                        className="delete-button"
                      >
                        <BsFillTrashFill />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center align-items-center my-3">
          <button
            variant="costum"
            onClick={handlePreviousPage}
            className="btn mx-2 other-button"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            variant="costum"
            className="btn mx-2 other-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* ========== EDIT MODAL ========== */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <label>ISBN</label>
                <input
                  type="text"
                  value={editIsbn}
                  onChange={(e) => setEditIsbn(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Title</label>
                <input
                  type="text"
                  value={editTitulli}
                  onChange={(e) => setEditTitulli(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Publication Year</label>
                <input
                  type="text"
                  value={editVitiPublikimit}
                  onChange={(e) => setEditVitiPublikimit(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Pages</label>
                <input
                  type="text"
                  value={editNrFaqeve}
                  onChange={(e) => setEditNrFaqeve(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Copies</label>
                <input
                  type="text"
                  value={editNrKopjeve}
                  onChange={(e) => setEditNrKopjeve(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Language</label>
                <input
                  type="text"
                  value={editGjuha}
                  onChange={(e) => setEditGjuha(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Publisher</label>
                <select
                  value={editSelectedShtepiaID}
                  onChange={(e) => setEditSelectedShtepiaID(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Publisher</option>
                  {shtepiaList.map((shtepia) => (
                    <option
                      key={shtepia.shtepiaBotueseID}
                      value={shtepia.shtepiaBotueseID}
                    >
                      {shtepia.emri}
                    </option>
                  ))}
                </select>
              </Col>
              <Col>
                <label>Genre</label>
                <select
                  value={editSelectedZhanriID}
                  onChange={(e) => setEditSelectedZhanriID(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Genre</option>
                  {zhanriList.map((z) => (
                    <option key={z.zhanriId} value={z.zhanriId}>
                      {z.emri}
                    </option>
                  ))}
                </select>
              </Col>
              <Col className="d-flex align-items-center mt-4">
                <input
                  type="checkbox"
                  checked={!!editInStock}
                  onChange={(e) => setEditInStock(e.target.checked ? 1 : 0)}
                  style={{ marginRight: "5px" }}
                />
                <label>In Stock</label>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Description</label>
                <textarea
                  value={editDescriptioni}
                  onChange={(e) => setEditDescriptioni(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
            <Col>
              <label>Authors</label>
              <Select
            isMulti
            value={editSelectedAuthors} 
            onChange={(selectedOptions) => {
              console.log("Selected options:", selectedOptions);
              setEditSelectedAuthors(selectedOptions); 
            }}
            options={allAuthors.map((author) => ({
              value: author.autori_ID, 
              label: author.emri, 
            }))}
          />

            </Col>
            </Row>

                    <Row className="mt-2">
                      <Col>
            {/* Display the Profile Picture Path */}
            <div className="form-group">
              <label htmlFor="editProfilePicturePath">Profile Picture Path</label>
              <input
                type="text"
                className="form-control"
                id="editProfilePicturePath"
                value={editProfilePicturePath}
                readOnly
              />
            </div>

            {/* Display the Profile Picture and Upload Option */}
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
          </Col>
        </Row>


          </Modal.Body>
          <Modal.Footer>
            <Button variant="custom" className="edit-button" onClick={handleClose}>
              Close
            </Button>
            <Button variant="custom" className="delete-button" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ========== ADD MODAL ========== */}
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <label>ISBN</label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Title</label>
                <input
                  type="text"
                  value={titulli}
                  onChange={(e) => setTitulli(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Publication Year</label>
                <input
                  type="text"
                  value={vitiPublikimit}
                  onChange={(e) => setVitiPublikimit(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Pages</label>
                <input
                  type="text"
                  value={nrFaqeve}
                  onChange={(e) => setNrFaqeve(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Copies</label>
                <input
                  type="text"
                  value={nrKopjeve}
                  onChange={(e) => setNrKopjeve(e.target.value)}
                  className="form-control"
                />
              </Col>
              <Col>
                <label>Language</label>
                <input
                  type="text"
                  value={gjuha}
                  onChange={(e) => setGjuha(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Publisher</label>
                <select
                  value={selectedShtepia}
                  onChange={(e) => setSelectedShtepia(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Publisher</option>
                  {shtepiaList.map((shtepia) => (
                    <option key={shtepia.shtepiaBotueseID} value={shtepia.shtepiaBotueseID}>
                      {shtepia.emri}
                    </option>
                  ))}
                </select>
              </Col>
              <Col>
                <label>Genre</label>
                <select
                  value={selectedZhanri}
                  onChange={(e) => setSelectedZhanri(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Genre</option>
                  {zhanriList.map((z) => (
                    <option key={z.zhanriId} value={z.zhanriId}>
                      {z.emri}
                    </option>
                  ))}
                </select>
              </Col>
              <Col className="d-flex align-items-center">
                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={!!inStock}
                    onChange={(e) => setInStock(e.target.checked ? 1 : 0)}
                    className="form-check-input"
                  />
                  <label>In Stock</label>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescriptioni(e.target.value)}
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Authors</label>
                <Select
                  isMulti
                  options={allAuthors.map((author) => ({
                    value: author.autori_ID,
                    label: author.emri,
                  }))}
                  onChange={handleAuthorSelection}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Profile Picture</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="form-control"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="custom" className="edit-button" onClick={handleCloseAddModal}>
              Close
            </Button>
            <Button variant="custom" className="delete-button" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
};

export default Libri;