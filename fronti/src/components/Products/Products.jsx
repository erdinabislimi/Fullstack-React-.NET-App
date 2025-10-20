import React, { useState, useEffect, useRef } from "react";
import { Grid, InputAdornment, Input, CircularProgress } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Product from "./Product/Product.js";
import useStyles from "./styles";
import logo1 from "../../assets/Bookshop.gif";
import scrollImg from "../../assets/scroll.gif";
import { Link } from "react-router-dom";
import mangaBg from "../../assets/romance.webp";
import bioBg from "../../assets/his.jpg";
import thrillerBg from "../../assets/thriller.jpg";
import crimeBg from "../../assets/crime.jpg";
import animeBg from "../../assets/anime.jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

const Products = ({ onAddToCart }) => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://localhost:7101/api/Libri");
        if (isMounted) {
          const fetchedProducts = response.data?.["$values"];
          if (Array.isArray(fetchedProducts)) {
            setProducts(fetchedProducts);
          } else {
            console.error("Fetched data is not an array:", fetchedProducts);
            setError("Failed to load products.");
          }
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
        setError("Failed to load products.");
      }
    };

    const fetchLatestBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://localhost:7101/api/Libri/latest");
        const latestBooksData = response.data?.["$values"] || []; // Accessing "$values"
        if (Array.isArray(latestBooksData)) {
          setLatestBooks(latestBooksData);
          setError(null);
        } else {
          console.error("Fetched latest books data is not an array:", latestBooksData);
          setError("Failed to load latest books.");
        }
      } catch (error) {
        console.error("Error fetching latest books:", error);
        setError("Failed to load latest books.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchLatestBooks();

    const interval = setInterval(() => {
      fetchLatestBooks();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleInputClick = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const uniqueProducts = Array.from(
    new Set(products.map((product) => product.id)) 
  ).map((id) => products.find((product) => product.id === id));

  const filteredProducts = uniqueProducts.filter((product) => {
    if (searchTerm.trim() === "") {
      return true;
    } else if (product.titulli) { 
      const lowercaseTitulli = product.titulli.toLowerCase();
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      return lowercaseTitulli.includes(lowercaseSearchTerm);
    }
    return false;
  });

  useEffect(() => {
    console.log("Filtered products list:", filteredProducts);
  }, [filteredProducts]);

  const shuffleArray = (array) => {
    if (!Array.isArray(array)) {
      console.error("shuffleArray expects an array, but got:", array);
      return [];
    }
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const FeaturedBooks = ({ filteredProducts, onAddToCart }) => {
    const [featuredBooks, setFeaturedBooks] = useState([]);

    useEffect(() => {
      const shuffledProducts = shuffleArray(filteredProducts);
      const selectedBooks = shuffledProducts.slice(0, 3);
      setFeaturedBooks(selectedBooks);
      console.log("Featured Books:", selectedBooks);
    }, [filteredProducts]);

    return (
      <Grid
        className={classes.contentFeatured}
        container
        justifyContent="center"
        spacing={1}
      >
        {featuredBooks.map((product) => (
          <Grid
            key={product.id}
            className={classes.content}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            id="pro"
          >
            <Product product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const getVisibleProducts = () => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const loadMoreProducts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <main className={classes.mainPage}>
      <div className={classes.toolbar} />
      <img
        src={scrollImg}
        className={`${classes.scrollImg} copy`}
        alt="scroll"
      />
      <div className={classes.hero}>
        <img
          className={classes.heroImg}
          src={logo1}
          height="720px"
          alt="Bookshop Logo"
        />

        <div className={classes.heroCont}>
          <h1 className={classes.heroHeader}>
            Gjeni librin tuaj të preferuar.
          </h1>
          <h3 className={classes.heroDesc} ref={sectionRef}>
            Eksploroni në koleksionin tonë të librave dhe gjeni librin tuaj të
            radhës që doni ta lexoni.
          </h3>
          <div className={classes.searchs}>
            <Input
              className={classes.searchb}
              type="text"
              placeholder="Cilin libër po kërkoni?"
              onClick={handleInputClick}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {searchTerm === "" && (
        <div className={classes.categorySection}>
          <h1 className={classes.categoryHeader}>Kategoritë</h1>
          <h3 className={classes.categoryDesc}>
            Shfletoni kategoritë tona të librave
          </h3>
          <div className={classes.buttonSection}>
            <div>
              <Link to="manga">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${mangaBg})` }}
                  aria-label="Romance"
                ></button>
              </Link>
              <div className={classes.categoryName}>Romance</div>
            </div>
            <div>
              <Link to="biography">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${bioBg})` }}
                  aria-label="Biografi"
                ></button>
              </Link>
              <div className={classes.categoryName}>Biografi</div>
            </div>
            <div>
              <Link to="fiction">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${thrillerBg})` }}
                  aria-label="Thriller"
                ></button>
              </Link>
              <div className={classes.categoryName}>Thriller</div>
            </div>
            <div>
              <Link to="crime">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${crimeBg})` }}
                  aria-label="Crime"
                ></button>
              </Link>
              <div className={classes.categoryName}>Crime</div>
            </div>
            <div>
              <Link to="anime">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${animeBg})` }}
                  aria-label="Animuar"
                ></button>
              </Link>
              <div className={classes.categoryName}>Animuar</div>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Section */}
      <div className={classes.carouselSection}>
        <Carousel
          showIndicators={false}
          autoPlay={true}
          infiniteLoop={true}
          showArrows={true}
          showStatus={false}
        >
          <div>
            <Link to="manga">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${mangaBg})` }}
                aria-label="Romance"
              ></button>
            </Link>
            <div className={classes.categoryName}>Romance</div>
          </div>
          <div>
            <Link to="biography">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${bioBg})` }}
                aria-label="Biografi"
              ></button>
            </Link>
            <div className={classes.categoryName}>Biografi</div>
          </div>
          <div>
            <Link to="fiction">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${thrillerBg})` }}
                aria-label="Thriller"
              ></button>
            </Link>
            <div className={classes.categoryName}>Thriller</div>
          </div>

          <div>
            <Link to="crime">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${crimeBg})` }}
                aria-label="Crime"
              ></button>
            </Link>
            <div className={classes.categoryName}>Crime</div>
          </div>
          <div>
            <Link to="anime">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${animeBg})` }}
                aria-label="Animuar"
              ></button>
            </Link>
            <div className={classes.categoryName}>Animuar</div>
          </div>
        </Carousel>
      </div>

      {/* Latest Books Section */}
      {searchTerm === "" && (
        <div>
          <h3 className={classes.contentHeader}>
            <span style={{ color: "#f1361d" }}>Librat</span> e{" "}
            <span style={{ color: "#f1361d" }}>Reja</span>
          </h3>
          {loading ? (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div className={classes.error}>
              <p>{error}</p>
            </div>
          ) : (
            <FeaturedBooks
              filteredProducts={latestBooks}
              onAddToCart={onAddToCart}
            />
          )}
        </div>
      )}

      {/* Books Listing Section */}
      <div>
        {searchTerm === "" && (
          <>
            <h1 className={classes.booksHeader}>
              Zbulo <span style={{ color: "#f1361d" }}>librat</span>
            </h1>
            <h3 className={classes.booksDesc}>
              Shfleto koleksionin tonë të librave.
            </h3>
          </>
        )}
        <div className={classes.mobileSearch}>
          <div className={classes.mobSearchs}>
            <Input
              className={classes.mobSearchb}
              type="text"
              placeholder="Cilin libër po kërkoni?"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </div>
        </div>
        <div>
          <Grid
            className={classes.contentFeatured}
            container
            justifyContent="center"
            spacing={1}
          >
            {getVisibleProducts().map((product) => (
              <Grid
                key={product.id}
                className={classes.content}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                id="pro"
              >
                <Product product={product} onAddToCart={onAddToCart} />
              </Grid>
            ))}
          </Grid>
        </div>
        {filteredProducts.length > currentPage * itemsPerPage && (
          <div className={classes.loadMore}>
            <div className="text-center mt-3">
              <button
                className={classes.loadMoreButton}
                onClick={loadMoreProducts}
                style={{ backgroundColor: "#001524", color: "#fff", fontSize: "25px" }}
              >
                More Books
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message Section */}
      {error && (
        <div className={classes.error}>
          <p>{error}</p>
        </div>
      )}
    </main>
  );
};

export default Products;

