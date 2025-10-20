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
import "./styles.css";

const Ratings = () => {
  const [ratingsList, setRatingsList] = useState([]);
  const [filteredRatingsList, setFilteredRatingsList] = useState([]);
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [klientID, setKlientID] = useState("");
  const [libriID, setLibriID] = useState("");
  const [klientName, setKlientName] = useState("");
  const [libriTitle, setLibriTitle] = useState("");
  const [editRatingID, setEditRatingID] = useState(null);
  const [libriList, setLibriList] = useState([]);
  const [klientiList, setKlientiList] = useState([]);
  const [klientNameFilter, setKlientNameFilter] = useState("");

  useEffect(() => {
    fetchRatingsList();
    getLibri();
    getKlienti();
  }, []);

  const fetchRatingsList = () => {
    axios
      .get(`https://localhost:7101/api/RatingComment`)
      .then((result) => {
        console.log("API Response:", result.data); 
        if (Array.isArray(result.data)) {
          setRatingsList(result.data);
          setFilteredRatingsList(result.data);
        } else if (result.data.$values) {
          setRatingsList(result.data.$values);
          setFilteredRatingsList(result.data.$values);
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

  const getLibri = () => {
    axios
      .get(`https://localhost:7101/api/Libri`)
      .then((result) => {
        const LibriData = result.data?.$values;
        if (Array.isArray(LibriData)) {
          setLibriList(LibriData);
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

  const handleEdit = (ratingsCommentID) => {
    setShow(true);
    axios
      .get(`https://localhost:7101/api/RatingComment/${ratingsCommentID}`)
      .then((result) => {
        setRating(result.data.rating);
        setComment(result.data.comment);
        setKlientID(result.data.klientID);
        setKlientName(result.data.klientName);
        setLibriID(result.data.libriID);
        setLibriTitle(result.data.libriTitle);
        setEditRatingID(result.data.ratingsCommentID);
      })
      .catch((error) => {
        console.error("Error fetching rating:", error);
      });
  };

  const handleDelete = (ratingsCommentID) => {
    if (window.confirm("Are you sure to delete this rating?")) {
      axios
        .delete(`https://localhost:7101/api/RatingComment/${ratingsCommentID}`)
        .then((result) => {
          if (result.status === 204) {
            toast.success("Rating has been deleted");
            const updatedList = ratingsList.filter(
              (item) => item.ratingsCommentID !== ratingsCommentID
            );
            setRatingsList(updatedList);
            setFilteredRatingsList(updatedList);
          }
        })
        .catch((error) => {
          toast.error("Failed to delete rating. Please try again.");
          console.error("Error deleting rating:", error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7101/api/RatingComment/${editRatingID}`;

    const data = {
      ratingsCommentID: editRatingID,
      rating: rating,
      comment: comment,
      klientID: klientID,
      klientName: klientName,
      libriID: libriID,
      libriTitle: libriTitle,
    };

    axios
      .put(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        setShow(false);
        fetchRatingsList(); 
        clear(); 
        toast.success("Rating has been updated");
      })
      .catch((error) => {
        toast.error("Failed to update rating. Please try again.");
        console.error("Error updating rating:", error);
      });
  };

  const handleSave = () => {
    const url = `https://localhost:7101/api/RatingComment`;

    const data = {
      ratingsCommentID: 0,
      rating: rating,
      comment: comment,
      klientID: klientID,
      klientName: klientName,
      libriID: libriID,
      libriTitle: libriTitle,
    };

    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        fetchRatingsList();
        clear(); 
        setShowAddModal(false);
        toast.success("Rating has been added");
      })
      .catch((error) => {
        toast.error("Failed to add rating. Please try again.");
        console.error("Error adding rating:", error);
      });
  };

  const clear = () => {
    setRating(0);
    setComment("");
    setKlientID("");
    setKlientName("");
    setLibriID("");
    setLibriTitle("");
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setKlientNameFilter(value);
    filterFn(value);
  };

  const filterFn = (filterValue) => {
    if (filterValue.trim() === "") {
      setFilteredRatingsList(ratingsList);
    } else {
      const filteredData = ratingsList.filter((el) => {
        return (el.klientName?.toString() ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase().trim());
      });
      setFilteredRatingsList(filteredData);
    }
  };

  const sortResult = (prop, asc) => {
    const sortedData = [...filteredRatingsList].sort((a, b) => {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    setFilteredRatingsList(sortedData);
  };

  return (
    <Fragment>
      <ToastContainer />
      <Container className="py-5">
        <h1>Ratings List</h1>
        <div className="d-flex justify-content-between mt-4 mb-4">
          <Button
            variant="custom"
            className="btn other-button"
            onClick={() => setShowAddModal(true)}
          >
            Add New Rating
          </Button>
        </div>

        <div className="ml-auto d-flex">
          <input
            className="form-control m-2"
            value={klientNameFilter}
            onChange={handleFilterChange}
            placeholder="Filter by Klient Name"
          />
          <button
            type="button"
            className="btn btn-light"
            onClick={() => sortResult("klientName", true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-down-square-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => sortResult("klientName", false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-up-square-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5v-5.793L9.646 7.854a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V10.5a.5.5 0 0 0 1 0z" />
            </svg>
          </button>
        </div>
        <Table className="table table-striped table-hover mt-2">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Comment</th>
              <th>Klient Name</th>
              <th>Libri Title</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredRatingsList) &&
              filteredRatingsList.map((item, index) => (
                <tr key={item.ratingsCommentID}>
                  <td>{item.rating}</td>
                  <td>{item.comment}</td>
                  <td>{item.klientName}</td>
                  <td>{item.libriTitle}</td>
                  <td>
                    <Button
                      className="mr-2 edit-button"
                      variant="custom"
                      onClick={() => handleEdit(item.ratingsCommentID)}
                    >
                      <BsFillPencilFill />
                    </Button>
                    <Button
                      className="delete-button"
                      variant="custom"
                      onClick={() => handleDelete(item.ratingsCommentID)}
                    >
                      <BsFillTrashFill />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>

      {/* Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
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
                {Array.isArray(klientiList) &&
                  klientiList.map((klient, index) => (
                    <option key={klient.klientID} value={klient.id}>
                      {klient.emri}
                    </option>
                  ))}
              </select>
              <select
                className="form-control"
                onChange={(e) => {
                  const selectedLibri = libriList.find(
                    (libri) => libri.id === parseInt(e.target.value)
                  );
                  setLibriID(selectedLibri?.id || "");
                  setLibriTitle(selectedLibri?.titulli || "");
                }}
              >
                <option value="">Select Libri</option>
                {Array.isArray(libriList) &&
                  libriList.map((libri, index) => (
                    <option key={libri.libriID} value={libri.id}>
                      {libri.titulli}
                    </option>
                  ))}
              </select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="edit-button"
            onClick={() => setShow(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="other-button"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
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
              <select
                className="form-control"
                onChange={(e) => {
                  const selectedLibri = libriList.find(
                    (libri) => libri.id === parseInt(e.target.value)
                  );
                  setLibriID(selectedLibri?.id || "");
                  setLibriTitle(selectedLibri?.titulli || "");
                }}
              >
                <option value="">Select Libri</option>
                {libriList.map((libri) => (
                  <option key={libri.libriID} value={libri.id}>
                    {libri.titulli}
                  </option>
                ))}
              </select>
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
            Add Rating
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Ratings;
