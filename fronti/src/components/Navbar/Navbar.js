import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Badge, Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import logo from "../../assets/circles.png";
import api from "../../api";
import { getUserIdFromToken } from './utilities';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../AuthContext';
import Notification from "../../Noitification/Notification";
import { FiBell, FiRefreshCcw, FiGrid, FiSun, FiMoon } from "react-icons/fi"; 
import PaymentForm from '../Products/Product/PaymentFoorm'; 
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7101';

const CustomNavbar = ({ totalItems, exchangeCount }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSurname, setEditSurname] = useState("");
  const [editNrPersonal, setEditNrPersonal] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [changesMade, setChangesMade] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const [navbarTheme, setNavbarTheme] = useState('dark'); 
  const history = useHistory();
  const [unreadCount, setUnreadCount] = useState(0); 
  const { userRole } = useAuth();

  const [showPaymentForm, setShowPaymentForm] = useState(false); 
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const dropdownRef = useRef(null);

 
  const getUserId = () => {
    const token = localStorage.getItem('authToken');
    return getUserIdFromToken(token);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.log('No valid user ID found in token');
          history.push('/login');
          return;
        }

        const response = await api.get(`/Klient/${userId}`);
        setUserInfo(response.data);
        setEditName(response.data.emri);
        setEditSurname(response.data.mbiemri);
        setEditNrPersonal(response.data.nrPersonal);
      } catch (error) {
        console.error('Error fetching user info:', error);
        history.push('/login');
      }
    };

    fetchUserInfo();
  }, [history]);

  const fetchUnreadCount = async () => {
    try {
      console.log("Fetching unread notifications count...");
      const response = await api.get("/Notification/unreadCount");

      if (response.status === 200) {
        const count = response.data;
        console.log("Unread notifications count:", count);
        setUnreadCount(count);
      } else {
        console.error("Failed to fetch unread count:", response.data);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();


    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const openNotificationModal = () => {
    setShowNotificationModal(true);
  };

  const markAllNotificationsRead = async () => {
    try {
      console.log("Marking notifications as read...");
      const userId = getUserId();

      if (!userId) {
        console.error("User ID is missing in the token.");
        return;
      }

      const response = await api.patch(`/Notification/markAllAsRead?klientId=${userId}`);
      console.log("Response from API:", response);

      if (response.status === 200) {
        console.log("Successfully marked notifications as read:", response.data.message);
        setUnreadCount(0); 
      } else {
        console.error("API responded with a failure:", response.data);
      }
    } catch (error) {
      console.error("Error in markAllNotificationsRead:", error);
    }
  };

  useEffect(() => {
    const validateRefreshToken = async () => {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/Klient/refresh-token', { refreshToken });
          const { Token, RefreshToken } = response.data;
          sessionStorage.setItem('refreshToken', RefreshToken);
          localStorage.setItem('authToken', Token);
        } catch (error) {
          console.error('Error validating refresh token:', error);
          sessionStorage.removeItem('refreshToken');
          localStorage.removeItem('authToken');
          history.push('/login');
        }
      } else {
        history.push('/login');
      }
    };

    const interval = setInterval(validateRefreshToken, 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [history]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('navbarTheme');
    if (savedTheme) {
      setNavbarTheme(savedTheme);
    }
  }, []);

  const toggleNavbarTheme = () => {
    const newTheme = navbarTheme === 'dark' ? 'light' : 'dark';
    setNavbarTheme(newTheme);
    localStorage.setItem('navbarTheme', newTheme);
  };

  const handleNameChange = (e) => {
    setEditName(e.target.value);
    setChangesMade(true);
  };

  const handleSurnameChange = (e) => {
    setEditSurname(e.target.value);
    setChangesMade(true);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePicture(file);
      setUserInfo((prevState) => ({
        ...prevState,
        profilePictureUrl: previewUrl,
      }));
      setChangesMade(true);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const closeNotificationModal = async () => {
    console.log("Closing notification modal...");
    try {
      await markAllNotificationsRead();

      setUnreadCount(0);
      console.log("Cleared notifications locally.");
    } catch (error) {
      console.error("Error closing notification modal:", error);
    } finally {
      setShowNotificationModal(false);
    }
  };

  const saveChanges = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.log('No valid user ID found in token');
        history.push('/login');
        return;
      }

      const formData = new FormData();
      if (editName !== userInfo.emri) formData.append('Emri', editName);
      if (editSurname !== userInfo.mbiemri) formData.append('Mbiemri', editSurname);
      if (profilePicture) formData.append('ProfilePicturePath', profilePicture);

      await api.patch(`/Klient/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUserInfo((prevState) => ({
        ...prevState,
        emri: editName !== prevState.emri ? editName : prevState.emri,
        mbiemri: editSurname !== prevState.mbiemri ? editSurname : prevState.mbiemri,
        profilePictureUrl: profilePicture ? URL.createObjectURL(profilePicture) : prevState.profilePictureUrl
      }));
      setDropdownOpen(false);
      setChangesMade(false);

      if (editName !== userInfo.emri) {
        toast.success(`Name updated to ${editName}`, { className: 'toast-success' });
      }
      if (editSurname !== userInfo.mbiemri) {
        toast.success(`Surname updated to ${editSurname}`, { className: 'toast-success' });
      }
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('notificationsShown'); 
    toast.success('Logged out successfully!', { className: 'toast-success' });
    history.push('/login');
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error logging out. Please try again.', { className: 'toast-error' });
    }
  };

  const triggerFileInput = () => {
    document.getElementById('profilePicInput').click();
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const handleCancel = () => {
    closeNotificationModal();
  };

  const toggleNotificationModal = () => {
    if (showNotificationModal) {
      closeNotificationModal();
    } else {
      setShowNotificationModal(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const handleOpenPaymentForm = () => {
    setShowPaymentForm(true);
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
  };

  const handlePaymentConfirm = async (details) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token missing. Please log in again.');
      }
  
      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('Invalid user ID in token.');
      }
  
      const paymentData = {
        klientId: userId,
        amount: details.amount,
        paymentStatus: "pending",
        paymentDate: new Date().toISOString(),
        validUntil: details.validUntil,
        stripePaymentMethodId: details.stripePaymentMethodId,
      };
  
      const response = await axios.post(`${API_BASE_URL}/api/Payment`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Payment processed successfully:', response.data);
      toast.success('Payment processed successfully!', { className: 'custom-toast' });
      setPaymentCompleted(true); 
      setShowPaymentForm(false); 
    } catch (error) {
      console.error('You are already a member:', error.response?.data || error.message);
      toast.error('You are already a member.', { className: 'custom-toast' });
    }
  };

  return (
    <>
      <style>
        {`
          /* Toast Styles */
          .toast-success {
            background-color: white !important;
            color: #001524 !important;
          }
          .toast-error {
            background-color: #f8d7da !important;
            color: #721c24 !important;
          }
          .custom-toast {
            background-color: #001524 !important;
            color: white !important;
            font-size: 14px !important;
            border-radius: 8px !important;
          }
          .btn-custom-cancel {
            background-color: #ffffff !important; /* White background */
            color: #001524 !important;            /* Blue text */
            border-color: #001524 !important;     /* Blue border */
            border-width: 1px !important;
            border-style: solid !important;
            border-radius: 4px !important;
            padding: 10px 20px !important;
            margin-right: 10px !important;
            cursor: pointer !important;
          }
          .btn-custom-logout {
            background-color: #001524 !important; /* Dark blue background */
            color: #ffffff !important;            /* White text */
            border-color: #001524 !important;     /* Dark blue border */
            border-width: 1px !important;
            border-style: solid !important;
            border-radius: 4px !important;
            padding: 10px 20px !important;
            cursor: pointer !important;
          }

          /* Greeting Styles */
          .greeting {
            margin-right: 15px;
            font-size: 1.1em;
            color: inherit;
          }

          /* Theme Toggle Button Styles */
          .theme-toggle-btn {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 1.5em;
            display: flex;
            align-items: center;
            margin-right: 15px;
          }

          /* Navbar Theme Styles */
          .navbar.dark-navbar {
            background-color: #001524 !important;
          }

          .navbar.light-navbar {
            background-color: #ffffff !important;
          }

          .navbar.dark-navbar .navbar-brand,
          .navbar.dark-navbar .nav-link,
          .navbar.dark-navbar .dropdown-toggle {
            color: #ffffff !important;
          }

          .navbar.light-navbar .navbar-brand,
          .navbar.light-navbar .nav-link,
          .navbar.light-navbar .dropdown-toggle {
            color: #000000 !important;
          }

          .navbar.dark-navbar .dropdown-menu {
            background-color: #ffffff !important;
            color: #000000 !important;
          }

          .navbar.light-navbar .dropdown-menu {
            background-color: #ffffff !important;
            color: #000000 !important;
          }

          /* Ensure Edit Profile Modal content remains with fixed colors */
          .edit-profile-modal .modal-content {
            background-color: #ffffff !important;
            color: #000000 !important;
          }

          /* Adjusting Dropdown Menu Items */
          .dropdown-menu.show {
            right: 0;
            left: auto;
          }

          /* Responsive Adjustments */
          @media (max-width: 992px) {
            .greeting {
              margin-right: 0;
              margin-bottom: 10px;
            }
            .theme-toggle-btn {
              margin-right: 0;
              margin-bottom: 10px;
            }
            .profile-section {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            }
            .navbar-collapse {
              padding: 20px;
            }
          }
        `}
      </style>
      <Navbar
        className={`navbar ${navbarTheme === 'dark' ? 'dark-navbar' : 'light-navbar'}`}
        variant={navbarTheme === 'dark' ? 'dark' : 'light'}
        expand="lg"
        fixed="top"
      >
        <Navbar.Brand as={Link} to="/Home" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Book Store App" height="30" className="d-inline-block align-top" />
          <span
            className="font-weight-bold text-uppercase ml-2"
            style={{
              fontSize: "1.5em",
              fontFamily: "system-ui",
              fontWeight: "bold",
              color: navbarTheme === 'light' ? "#000" : "#fff"
            }}
          >
            BIBLIOTEKA
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          {/* Left Side Navigation Links */}
          <Nav className="mr-auto">
            {userRole === 'admin' && (
              <Nav.Link as={Link} to="/dashboard">
                <FiGrid
                  style={{
                    marginRight: "8px",
                    fontSize: "1.5em",
                    color: navbarTheme === 'light' ? "#000" : "#fff"
                  }}
                />
              </Nav.Link>
            )}
            <div style={{ position: 'relative' }}>
              <Nav.Link
                onClick={openNotificationModal}
                style={{ position: 'relative' }}
              >
                <FiBell
                  style={{
                    fontSize: "1.5em",
                    marginRight: "8px",
                    color: navbarTheme === "light" ? "#000" : "#fff",
                  }}
                />
                {unreadCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                      fontSize: "0.7em",
                    }}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Nav.Link>
              <Notification showModal={showNotificationModal} toggleModal={toggleNotificationModal} />
            </div>
            {userRole === 'user' && (
              <Nav.Link as={Link} to="/Exchange">
                <FiRefreshCcw
                  style={{
                    fontSize: "1.5em",
                    color: navbarTheme === 'light' ? "#000" : "#fff",
                    marginRight: "8px"
                  }}
                />
              </Nav.Link>
            )}
            {/* Add Pay Emoji in Navbar */}
            {userRole === 'user' && !paymentCompleted && (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={`tooltip-pay`}>Pay</Tooltip>}
              >
                <Nav.Link onClick={handleOpenPaymentForm} style={{ marginLeft: '10px' }}>
                  <span
                    role="img"
                    aria-label="Pay"
                    style={{
                      fontSize: '1.5em', 
                      cursor: 'pointer',
                      color: '#1976d2', 
                    }}
                  >
                    💳
                  </span>
                </Nav.Link>
              </OverlayTrigger>
            )}
          </Nav>
          <Nav.Link as={Link} to="/UserListEvent" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: "1.2em" }}>
              📅 Events
            </span>
          </Nav.Link>

          {/* Right Side: Greeting, Theme Toggle, Profile */}
          <Nav className="ml-auto align-items-center" style={{ marginRight: '120px', color: navbarTheme === 'light' ? "#000" : "#fff" }}>
            {userInfo && (
              <>
                {/* Personalized Greeting */}
                <span className="greeting">
                  Hello, {userInfo.emri}!
                </span>
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleNavbarTheme}
                  className="theme-toggle-btn"
                  aria-label="Toggle Navbar Theme"
                >
                  {navbarTheme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>
                {/* Profile Image and Name */}
                <img
                  src={userInfo.profilePictureUrl}
                  alt="Profile"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '10px'
                  }}
                />
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="dropdown-toggle"
                  style={{
                    cursor: 'pointer',
                    paddingTop: '5px',
                    fontSize: '1em',
                    color: navbarTheme === 'light' ? "#000" : "#fff"
                  }}
                >
                  {userInfo.emri}
                </div>
              </>
            )}
            {dropdownOpen && userInfo && (
              <div
                className="dropdown-menu show"
                ref={dropdownRef}
                style={{
                  position: 'absolute',
                  right: '0',
                  padding: '10px',
                  marginTop: '385px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  textAlign: 'center',
                  minWidth: '250px'
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <strong>Edit Profile</strong>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <img
                    src={userInfo.profilePictureUrl}
                    alt="Profile"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      marginBottom: '10px'
                    }}
                  />
                  <input
                    type="file"
                    id="profilePicInput"
                    style={{ display: 'none' }}
                    onChange={handleProfilePictureChange}
                  />
                  <button
                    onClick={triggerFileInput}
                    style={{
                      display: 'block',
                      width: '100%',
                      margin: '10px 0',
                      padding: '10px',
                      backgroundColor: '#001524',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    Change Picture
                  </button>
                </div>
                <div className="d-flex flex-column flex-md-row" style={{ gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={handleNameChange}
                    placeholder="Edit Name"
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={editSurname}
                    onChange={handleSurnameChange}
                    placeholder="Edit Surname"
                  />
                </div>

                <div className="d-flex flex-column flex-md-row" style={{ gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={editNrPersonal}
                    readOnly
                  />
                  <button
                    onClick={saveChanges}
                    style={{
                      backgroundColor: '#001524',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px',
                      width: '100px'
                    }}
                  >
                    Save
                  </button>
                </div>

                <div className="d-flex flex-column flex-md-row" style={{ gap: '10px' }}>
                  <button
                    onClick={() => setShowLogoutModal(true)} 
                    style={{
                      backgroundColor: '#001524',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px',
                      width: '100%'
                    }}
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      backgroundColor: '#001524',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px',
                      width: '100%'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCancelLogout} centered className="edit-profile-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleCancelLogout}
            className="btn-custom-cancel" 
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            className="btn-custom-logout" 
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Form Modal */}
      <PaymentForm
        open={showPaymentForm}
        onClose={handleClosePaymentForm}
        onConfirm={handlePaymentConfirm}
      />

      <Notification showModal={showNotificationModal} toggleModal={toggleNotificationModal} />
      <ToastContainer />
    </>
  );
};

export default CustomNavbar;
