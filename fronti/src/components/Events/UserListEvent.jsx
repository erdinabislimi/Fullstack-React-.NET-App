
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import CustomNavbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuth } from '../../AuthContext';

const UserListEvent = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("authToken");
    const { userRole } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("https://localhost:7101/api/Events", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const eventArray = response.data?.$values || [];
            setEvents(eventArray);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Failed to load events.");
            setLoading(false);
        }
    };
    const GetUserId = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.id || 0;
    };

    const handleRSVP = async (eventId) => {
        try {
            const rsvpResponse = await axios.post(
                `https://localhost:7101/api/Events/${eventId}/rsvp`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (rsvpResponse.status === 200) {
                toast.success("RSVP successful!");

                fetchEvents();
            }
        } catch (error) {
            console.error("Error RSVPing:", error);
            toast.error(error.response?.data || "Failed to RSVP.");
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const deleteResponse = await axios.delete(
                    `https://localhost:7101/api/Events/${eventId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (deleteResponse.status === 200 || deleteResponse.status === 204) {
                    toast.success("Event deleted successfully!");

                    fetchEvents();
                }
            } catch (error) {
                console.error("Error deleting event:", error);
                toast.error("Failed to delete the event.");
            }
        }
    };


    if (loading) {
        return (
            <>
                <CustomNavbar />
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ marginTop: "4rem" }}
                >
                    <Spinner animation="border" variant="primary" />
                </div>
                <Footer />
            </>
        );
    }

    if (events.length === 0) {
        return (
            <>
                <CustomNavbar />
                <div className="text-center mt-5">
                    <h4>No events available.</h4>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <CustomNavbar />
            <div
                className="container"
                style={{ marginTop: "5rem", marginBottom: "5rem" }}
            >
                <h2 className="text-center mb-4">Upcoming Events</h2>

                <div className="d-flex flex-wrap justify-content-center">
                    {events.map((ev) => {
                        const rsvpArray = ev.eventRSVPs?.$values || [];
                        const rsvpCount = rsvpArray.length;

                        return (
                            <div
                                key={ev.eventId}
                                className="card mb-4"
                                style={{
                                    width: "90%",
                                    display: "flex",
                                    flexDirection: "row",
                                    margin: "10px",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                                    backgroundColor: "#ffffff",
                                    minHeight: "140px",
                                    padding: "20px"
                                }}
                            >

                                {ev.imagePath ? (
                                    <img
                                        src={ev.imagePath}
                                        alt="Event"
                                        style={{
                                            width: "250px",
                                            objectFit: "cover",
                                            borderTopLeftRadius: "0.25rem",
                                            borderBottomLeftRadius: "0.25rem"
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "250px",
                                            backgroundColor: "#f0f0f0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <span>No Image</span>
                                    </div>
                                )}


                                <div
                                    className="card-body"
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <div>
                                        <h5 className="card-title">{ev.name}</h5>
                                        <p className="card-text">{ev.description}</p>
                                        <p className="card-text text-muted">
                                            Date: {new Date(ev.eventDate).toLocaleString()}
                                        </p>
                                        <p className="card-text text-muted">
                                            Attendees: {rsvpCount}
                                        </p>
                                    </div>

                                    <div>
                                        {userRole && userRole.toLowerCase() === "user" && (
                                            <Button
                                                onClick={() => handleRSVP(ev.eventId)}
                                                style={{
                                                    backgroundColor: "#001524",
                                                    border: "none",
                                                    color: "#ffffff",
                                                    padding: "10px 20px",
                                                    fontSize: "1rem",
                                                    cursor: "pointer",
                                                    alignSelf: "flex-start",
                                                    marginTop: "10px"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = "#003366";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = "#001524";
                                                }}
                                            >
                                                Attend
                                            </Button>
                                        )}

                                        {userRole && userRole.toLowerCase() === "admin" && (
                                            <Button
                                                onClick={() => handleDelete(ev.eventId)}
                                                style={{
                                                    backgroundColor: "#dc3545",
                                                    border: "none",
                                                    color: "#ffffff", 
                                                    padding: "10px 20px",
                                                    fontSize: "1rem",
                                                    cursor: "pointer",
                                                    alignSelf: "flex-start",
                                                    marginTop: "10px"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = "#c82333";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = "#dc3545";
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserListEvent;
