import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";
import pexelsImage from "./images/6736905.jpg";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const { login } = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `https://localhost:7101/api/Klient/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.token && responseData.refreshToken) {
          localStorage.setItem('authToken', responseData.token);
          sessionStorage.setItem('refreshToken', responseData.refreshToken);

          login(responseData.token);
          history.push("/home");
          setEmail("");
          setPassword("");
        } else {
          setErrorMessage("Invalid email or password.");
        }
      } else {
        setErrorMessage("An error occurred while logging in.");
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      setErrorMessage("An error occurred while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="auth-container">
      {/* Left Side with Background */}
      <div className="auth-left">
        <img src={pexelsImage} alt="Login Background" className="background-image" />
      </div>
  
      {/* Right Side with Login Form */}
      <div className="auth-right">
        <div className="form-wrapper">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
  
          {/* Error Message */}
          {errorMessage && <div className="auth-error">{errorMessage}</div>}
  
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="auth-input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
  
            {/* Password Input */}
            <div className="auth-input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
            <div className="auth-footer">
  <p>
    Don't have an account?{" "}
    <Link to="/Registration" className="auth-link">
      Register here
    </Link>
  </p>
</div>
          </form>
  
          {/* Social Login */}
          <div className="auth-social">
            <p>Or sign in with</p>
            <div className="auth-social-icons">
              <a href="#" className="fab fa-facebook"></a>
              <a href="#" className="fab fa-twitter"></a>
              <a href="#" className="fab fa-google"></a>
            </div>
          </div>
        </div>
      </div>
  
      {/* Styling */}
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
    flex-direction: row;
  }

  .auth-left {
    flex: 1;
    background-color: #00394f;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .auth-right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .form-wrapper {
    max-width: 400px;
    width: 100%;
    text-align: center;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

  .auth-title {
    font-size: 2.5rem;
    color: #00394f;
    margin-bottom: 10px;
  }

  .auth-subtitle {
    font-size: 1rem;
    color: #777;
    margin-bottom: 30px;
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
    color: #777;
  }

  .auth-input-group input {
    width: 100%;
    padding: 10px 10px 10px 35px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }

  .auth-input-group input:focus {
    border-color: #00394f;
    box-shadow: 0 0 5px rgba(0, 57, 79, 0.3);
  }

  .auth-button {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    color: #fff;
    background-color: #00394f;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .auth-button:hover {
    background-color: #004c65;
  }

  .auth-error {
    color: #d32f2f;
    background-color: #ffdddd;
    padding: 10px;
    border: 1px solid #d32f2f;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 0.9rem;
  }

  .auth-social {
    margin-top: 20px;
  }

  .auth-social p {
    color: #777;
    margin-bottom: 10px;
  }

  .auth-social-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .auth-social-icons a {
    font-size: 1.5rem;
    color: #00394f;
    transition: color 0.3s ease, transform 0.3s ease;
  }

  .auth-social-icons a:hover {
    color: #004c65;
    transform: scale(1.2);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .auth-container {
      flex-direction: column;
    }

    .auth-left {
      flex: none;
      height: 50vh;
    }

    .auth-right {
      flex: none;
      height: 50vh;
      padding: 10px;
    }

    .auth-title {
      font-size: 2rem;
    }

    .auth-subtitle {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .form-wrapper {
      padding: 20px;
    }

    .auth-title {
      font-size: 1.8rem;
    }

    .auth-subtitle {
      font-size: 0.8rem;
    }

    .auth-input-group input {
      font-size: 0.9rem;
      padding: 8px 8px 8px 30px;
    }

    .auth-button {
      padding: 10px;
      font-size: 0.9rem;
    }
  }


      `}</style>
    </div>
  );
  
  
};

export default Login;
