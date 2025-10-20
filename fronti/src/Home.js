import React, { useState, useEffect } from "react";
import { CssBaseline } from "@material-ui/core";
import Products from "./components/Products/Products";
import Navbar from "./components/Navbar/Navbar";
import ProductView from "./components/ProductView/ProductView";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import loadingImg from "./assets/loader.gif";
import "./style.css";
import Biography from "./components/Bio/Biography";
import axios from "axios";
import Manga from "./components/Manga/Manga";
import Crime from "./components/Crime/Crime";
import Fiction from "./components/Fiction/Fiction";

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [mostExchangedBooks, setMostExchangedBooks] = useState([]);
  const [activeSection, setActiveSection] = useState("products");
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      history.push("/login");
    }
  }, [history]);

  const fetchBooks = async () => {
    axios
      .get("https://localhost:7101/api/Libri")
      .then((response) => {
        const uniqueBooks = Array.from(
          new Set(response.data.map((book) => book.id))
        ).map((id) => response.data.find((book) => book.id === id));
        setBooks(uniqueBooks);
      })
      .catch((error) => {
        console.error("Error fetching book data:", error);
      });
  };

  const fetchMostExchangedBooks = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7101/api/Exchange/TopExchangedBooks"
      );
      setMostExchangedBooks(response.data);
    } catch (error) {
      console.error("Error fetching top three most exchanged books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchMostExchangedBooks();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "books":
        return (
          <div className="container">
            <h1 className="text-center mt-5 mb-4">E-Library</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {mostExchangedBooks.map((book) => (
                <div key={book.libriId} className="col">
                  <div className="book-card">
                    <div className="book-cover">
                      <img
                        src={book.profilePictureUrl}
                        alt={book.titulli}
                        className="card-img-top"
                      />
                    </div>
                    <div className="book-details">
                      <h5 className="book-title">{book.titulli}</h5>
                      <p className="book-isbn">ISBN: {book.isbn}</p>
                      <p
                        className={`book-stock ${
                          book.inStock ? "text-success" : "text-danger"
                        }`}
                      >
                        {book.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                      <button className="btn btn-primary">Exchange</button>
                    </div>
                  </div>
                </div>
              ))}

              {books.map((book) => (
                <div key={book.id} className="col">
                  <div className="book-card">
                    <div className="book-cover">
                      <img
                        src={book.profilePictureUrl}
                        alt={book.titulli}
                        className="card-img-top"
                      />
                    </div>
                    <div className="book-details">
                      <h5 className="book-title">{book.titulli}</h5>
                      <p className="book-isbn">ISBN: {book.isbn}</p>
                      <p
                        className={`book-stock ${
                          book.inStock ? "text-success" : "text-danger"
                        }`}
                      >
                        {book.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                      <button className="btn btn-primary">Exchange</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <Products />;
    }
  };

  return (
    <div>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <div style={{ display: "flex" }}>{renderActiveSection()}</div>
      <Footer />
    </div>
  );
};

export default Home;
