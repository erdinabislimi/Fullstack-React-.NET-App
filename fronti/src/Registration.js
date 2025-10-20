import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import pexelsImage from "./images/6736905.jpg";

const Registration = () => {
  const [qytetiList, setQytetiList] = useState([]);
  const [selectedQytetiID, setSelectedQytetiID] = useState("");
  const [formData, setFormData] = useState({
    Emri: "",
    Mbiemri: "",
    NrPersonal: "",
    Email: "",
    Adresa: "",
    Statusi: "",
    NrTel: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    const {
      Emri,
      Mbiemri,
      NrPersonal,
      Email,
      Adresa,
      Statusi,
      NrTel,
      Password,
      ConfirmPassword,
    } = formData;
  
    if (!/^[A-Z][a-zA-Z]*$/.test(Emri)) {
      toast.error("⚠️ Emri must start with a capital letter and contain only letters.");
      return false;
    }
  
    if (!/^[A-Z][a-zA-Z]*$/.test(Mbiemri)) {
      toast.error("⚠️ Mbiemri must start with a capital letter and contain only letters.");
      return false;
    }
  
    if (!/^\d{10}$/.test(NrPersonal)) {
      toast.error("⚠️ NrPersonal must be exactly 10 digits long.");
      return false;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      toast.error("⚠️ Invalid email format.");
      return false;
    }
  
    if (Adresa.length < 5 || Adresa.length > 30 || !/^[a-zA-Z\s]*$/.test(Adresa)) {
      toast.error("⚠️ Adresa must be 5-30 characters long and contain only letters.");
      return false;
    }
  
    if (!/^[a-zA-Z]+$/.test(Statusi)) {
      toast.error("⚠️ Statusi must contain only letters.");
      return false;
    }
  
    if (!/^\d{9}$/.test(NrTel)) {
      toast.error("⚠️ NrTel must be exactly 9 digits long.");
      return false;
    }
  
    if (Password !== ConfirmPassword) {
      toast.error("⚠️ Passwords do not match.");
      return false;
    }
  
    return true;
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    if (!validateForm()) {
      return;
    }
  
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    payload.append("qytetiId", selectedQytetiID);
    if (selectedFile) payload.append("profilePicturePath", selectedFile);
  
    try {
      console.log("Submitting payload:", payload); 
      await axios.post("https://localhost:7101/api/Klient", payload);
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => history.push("/login"), 3000);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    axios
      .get("https://localhost:7101/api/Qyteti")
      .then((res) => setQytetiList(res.data?.$values || []))
      .catch(() => toast.error("Failed to fetch city data."));
  }, []);

  return (
    
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Left Side with Background */}
      <div className="auth-left">
        <img src={pexelsImage} alt="Login Background" className="background-image" />
      </div>
  
  
      {/* Right Side with Registration Form */}
      <div className="auth-right">
        <div className="form-wrapper">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Register to get started</p>
  
          <form onSubmit={handleSubmit}>
            {/* Name Inputs */}
            <div className="row gx-3 mb-3">
              <div className="col-md-6 auth-input-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="First Name"
                  name="Emri"
                  value={formData.Emri}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 auth-input-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Last Name"
                  name="Mbiemri"
                  value={formData.Mbiemri}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
  
            {/* Personal ID and Email */}
            <div className="auth-input-group">
              <i className="fas fa-id-card"></i>
              <input
                type="text"
                placeholder="Personal ID"
                name="NrPersonal"
                value={formData.NrPersonal}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email Address"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
  
            {/* Address and Status */}
            <div className="row gx-3 mb-3">
              <div className="col-md-6 auth-input-group">
                <i className="fas fa-home"></i>
                <input
                  type="text"
                  placeholder="Address"
                  name="Adresa"
                  value={formData.Adresa}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 auth-input-group">
                <i className="fas fa-info-circle"></i>
                <input
                  type="text"
                  placeholder="Status"
                  name="Statusi"
                  value={formData.Statusi}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
  
            {/* Phone Number */}
            <div className="auth-input-group">
              <i className="fas fa-phone"></i>
              <input
                type="text"
                placeholder="Phone Number"
                name="NrTel"
                value={formData.NrTel}
                onChange={handleChange}
                required
              />
            </div>
  
            {/* Password Inputs */}
            <div className="row gx-3 mb-3">
              <div className="col-md-6 auth-input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 auth-input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="ConfirmPassword"
                  value={formData.ConfirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
  
            {/* City Selector and File Upload */}
            <div className="row gx-3 mb-4">
              <div className="col-md-6 auth-input-group">
                <select
                  className="form-select"
                  value={selectedQytetiID}
                  onChange={(e) => setSelectedQytetiID(e.target.value)}
                  required
                >
                  <option value="">Select City</option>
                  {qytetiList.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.emri}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 auth-input-group">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
  
            {/* Submit Button */}
            <button type="submit" className="auth-button">
    Register Now
  </button>
  <p>
    Already have an account?{" "}
    <Link to="/Login" className="auth-link">
      Log In
    </Link>
  </p>
          </form>
        </div>
      </div>
  
      <style>{`

  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  .auth-container {
    display: flex;
    height: 100vh;
    background-color: #fff;
  }

  .auth-left {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    overflow: hidden;
  }

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .auth-right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 20px;
  }

  .form-wrapper {
    max-width: 500px;
    width: 100%;
    padding: 30px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .auth-title {
    color: #00394f;
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .auth-subtitle {
    color: #777;
    margin-bottom: 20px;
  }

  .auth-input-group {
    position: relative;
    margin-bottom: 20px;
  }

  .auth-input-group i {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #aaa;
  }

  .auth-input-group input,
  .form-select {
    width: 100%;
    padding: 10px 10px 10px 35px;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: border-color 0.3s ease;
  }

  .auth-input-group input:focus,
  .form-select:focus {
    border-color: #00394f;
    box-shadow: 0 0 5px rgba(0, 57, 79, 0.2);
  }

  .auth-button {
    background-color: #00394f;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 5px;
    font-size: 1rem;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .auth-button:hover {
    background-color: #004c65;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .auth-container {
      flex-direction: column; /* Stack sections vertically */
    }
.Toastify__toast-container {
  z-index: 9999;
}
    .auth-left,
    .auth-right {
      flex: none;
      height: 50vh;
      width: 100%;
    }

    .auth-title {
      font-size: 1.8rem;
    }

    .form-wrapper {
      padding: 20px;
      max-width: 400px;
    }

    .auth-input-group input,
    .form-select {
      padding: 10px 8px 10px 30px;
    }

    .auth-button {
      padding: 10px;
    }
  }

  @media (max-width: 480px) {
    .auth-title {
      font-size: 1.5rem;
    }

    .form-wrapper {
      padding: 15px;
      max-width: 320px;
    }

    .auth-input-group input,
    .form-select {
      font-size: 0.9rem;
    }

    .auth-button {
      font-size: 0.9rem;
      padding: 8px;
    }
  }


`}</style>


    </div>
  );
  
  
  
};

export default Registration;
