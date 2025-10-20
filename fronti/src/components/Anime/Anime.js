import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Product from "../Products/Product/Product.js";
import useStyles from "../Products/styles.js";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../ProductView/style.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import {
  Container,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Box,
  Paper,
  Avatar,
  Collapse,
  makeStyles,
} from "@material-ui/core";
const Anime = ({ onAddToCart }) => {
  const classes = useStyles();
  const [animeProducts, setAnimeProducts] = useState([]);
  

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7101/api/Libri");
        if (isMounted) {
          const fetchedProducts = response.data?.["$values"] || response.data;
          if (Array.isArray(fetchedProducts)) {
            const animes = fetchedProducts.filter(
              (product) => product.zhanri.emri === "Anime"
            );
            setAnimeProducts(animes);

           
            console.log("Fetched data:", fetchedProducts);
            console.log("Filtered anime products:", animes);
          } else {
            console.error("Fetched data is not an array:", fetchedProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <main className={classes.mainPage}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <div className={classes.toolbar} />
      <div className={classes.categorySection}>
        <h3 className={classes.categoryHeader}>
          <span style={{ color: "#f1361d" }}>Animuar</span>
        </h3>
        <h3 className={classes.categoryDesc}>
          Browse our handpicked selection of Animuar series
        </h3>
        <Grid
          className={classes.categoryFeatured}
          container
          justifyContent="center" 
          spacing={1}
        >
          {animeProducts.length === 0 ? (
            <p>No anime products available</p>
          ) : (
            animeProducts.map((product) => (
              <Grid
                key={product.id} 
                className={classes.categoryFeatured}
                item
                xs={6}
                sm={5}
                md={3}
                lg={2}
                id="pro"
              >
                <Product product={product} onAddToCart={onAddToCart} />
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </main>
  );
};

export default Anime;
