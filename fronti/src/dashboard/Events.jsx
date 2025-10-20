// src/pages/Events.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { getUserIdFromToken } from "../components/Navbar/utilities";
import getUserRoleFromToken from "./getUserRoleFromToken";
import Sidebar from "./Sidebar";
import { BsThreeDotsVertical } from "react-icons/bs";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const [showSidebar, setShowSidebar] = useState(false);
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const [showAddModal, setShowAddModal] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventImage, setEventImage] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editEventName, setEditEventName] = useState("");
    const [editEventDescription, setEditEventDescription] = useState("");
    const [editEventDate, setEditEventDate] = useState("");
    const [editEventImagePath, setEditEventImagePath] = useState(""); 
    const [editEventImageUrl, setEditEventImageUrl] = useState("");   
    const [editSelectedFile, setEditSelectedFile] = useState(null);

    const [showRSVPModal, setShowRSVPModal] = useState(false);
    const [rsvpEvent, setRsvpEvent] = useState(null);

    const token = localStorage.getItem("authToken");
    const userRole = getUserRoleFromToken(token);
    const isAdmin = userRole === "admin" || userRole === "Admin" || userRole === "2";

    useEffect(() => {
        fetchEvents();
    }, []);

    // ---------------------------
    // Fetch all Events
    // ---------------------------
    const fetchEvents = async () => {
        try {
            const response = await axios.get("https://localhost:7101/api/Events", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const arrayOfEvents = response.data?.$values ?? [];
            setEvents(arrayOfEvents);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Failed to load events.");
            setLoading(false);
        }
    };

    // ---------------------------
    // Add (POST) an event
    // ---------------------------
    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!eventName || !eventDate) {
            toast.error("Please provide at least the event name and date.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("Name", eventName);
            formData.append("Description", eventDescription);
            formData.append("EventDate", eventDate);
            if (eventImage) {
                formData.append("Image", eventImage);
            }

            const response = await axios.post("https://localhost:7101/api/Events", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                toast.success("Event created successfully!");
                setShowAddModal(false);
                // Clear fields
                setEventName("");
                setEventDescription("");
                setEventDate("");
                setEventImage(null);
                // Reload
                fetchEvents();
            }
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("Failed to create event.");
        }
    };

    // ---------------------------
    // Open Edit Modal (GET single event)
    // ---------------------------
    const handleOpenEdit = async (eventId) => {
        try {
            // Clear old data
            setEditId(null);
            setEditEventName("");
            setEditEventDescription("");
            setEditEventDate("");
            setEditEventImagePath("");
            setEditEventImageUrl("");
            setEditSelectedFile(null);

            const response = await axios.get(`https://localhost:7101/api/Events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const ev = response.data;

            setEditId(ev.eventId);
            setEditEventName(ev.name || "");
            setEditEventDescription(ev.description || "");
            if (ev.eventDate) {
                setEditEventDate(ev.eventDate.substr(0, 10));
            }

            if (ev.imagePath) {
                setEditEventImagePath(ev.imagePath);
                setEditEventImageUrl(ev.imagePath); 
            }

            setShowEditModal(true);
        } catch (error) {
            console.error("Error fetching event details:", error);
            toast.error("Failed to fetch event details.");
        }
    };

    // ---------------------------
    // Edit (PUT) an event
    // ---------------------------
    const handleEditEvent = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Name", editEventName);
        formData.append("Description", editEventDescription);
        formData.append("EventDate", editEventDate);

        if (editSelectedFile) {
            formData.append("Image", editSelectedFile);
        } else if (editEventImagePath) {
            formData.append("ImagePath", editEventImagePath);
        }

        console.log("Form Data:", [...formData.entries()]);

        try {
            const response = await axios.put(
                `https://localhost:7101/api/Events/${editId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 204) {
                toast.success("Event updated successfully!");
                setShowEditModal(false);
                fetchEvents();
            }
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event.");
        }
    };


    const handleEditFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setEditEventImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!isAdmin) {
            toast.error("Only admins can delete events!");
            return;
        }
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const response = await axios.delete(`https://localhost:7101/api/Events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 204) {
                    toast.success("Event deleted successfully!");
                    fetchEvents();
                }
            } catch (error) {
                console.error("Error deleting event:", error);
                toast.error("Failed to delete event.");
            }
        }
    };

    const handleRSVP = (eventObj) => {
        setRsvpEvent(eventObj);
        setShowRSVPModal(true);
    };

    const confirmRSVP = async () => {
        try {
            const response = await axios.post(
                `https://localhost:7101/api/Events/${rsvpEvent.eventId}/rsvp`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                toast.success("RSVP successful!");
                setShowRSVPModal(false);
                fetchEvents();
            }
        } catch (error) {
            console.error("Error RSVPing to event:", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Failed to RSVP. Please try again.");
            }
            setShowRSVPModal(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="mt-5">
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
            <h2 className="mb-4">Events</h2>

            {isAdmin && (
                <Button className="add-event-button mb-3" onClick={() => setShowAddModal(true)}>
                    Add Event
                </Button>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Event Name</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Image</th>
                        <th>RSVPs</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No events available.
                            </td>
                        </tr>
                    ) : (
                        events.map((ev, index) => (
                            <tr key={ev.eventId}>
                                <td>{index + 1}</td>
                                <td>{ev.name}</td>
                                <td>{ev.description}</td>
                                <td>{new Date(ev.eventDate).toLocaleDateString()}</td>
                                <td>
                                    {ev.imagePath ? (
                                        <img src={ev.imagePath} alt={ev.name} width="100" />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>{ev.eventRSVPs?.$values?.length || 0}</td>
                                <td>
                                    {isAdmin && (
                                        <Fragment>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="mr-2"
                                                onClick={() => handleOpenEdit(ev.eventId)}
                                            >
                                                <BsFillPencilFill /> Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteEvent(ev.eventId)}
                                            >
                                                <BsFillTrashFill /> Delete
                                            </Button>
                                        </Fragment>
                                    )}
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleRSVP(ev)}
                                        className="ml-2"
                                    >
                                        <FiCheckCircle /> RSVP
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Add Event Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Event</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddEvent}>
                    <Modal.Body>
                        <Form.Group controlId="addEventName">
                            <Form.Label>Event Name *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event name"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="addEventDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter event description"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="addEventDate">
                            <Form.Label>Event Date *</Form.Label>
                            <Form.Control
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="addEventImage">
                            <Form.Label>Event Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEventImage(e.target.files[0])}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Event
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Event Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditEvent}>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group controlId="editEventName">
                                    <Form.Label>Event Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter event name"
                                        value={editEventName}
                                        onChange={(e) => setEditEventName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="editEventDate">
                                    <Form.Label>Event Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editEventDate}
                                        onChange={(e) => setEditEventDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="editEventDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter event description"
                                value={editEventDescription}
                                onChange={(e) => setEditEventDescription(e.target.value)}
                            />
                        </Form.Group>

                        {/* The stored path */}
                        <Form.Group controlId="editEventImagePath">
                            <Form.Label>Profile Picture Path</Form.Label>
                            <Form.Control
                                type="text"
                                value={editEventImagePath}
                                readOnly
                            />
                        </Form.Group>

                        {/* Preview + Upload */}
                        <Form.Group controlId="editEventImage">
                            <Form.Label>Event Image</Form.Label>
                            {editEventImageUrl && (
                                <div style={{ marginBottom: "10px" }}>
                                    <img
                                        src={editEventImageUrl}
                                        alt="Event"
                                        width="100"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleEditFileUpload}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Event
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* RSVP Confirmation Modal */}
            <Modal show={showRSVPModal} onHide={() => setShowRSVPModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm RSVP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {rsvpEvent && (
                        <>
                            <p>
                                Are you sure you want to RSVP to <strong>{rsvpEvent.name}</strong>?
                            </p>
                            <p>
                                <strong>Date:</strong> {new Date(rsvpEvent.eventDate).toLocaleDateString()}
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRSVPModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmRSVP}>
                        Confirm RSVP
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default Events;
