import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Button } from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import notificationService from '../../../Noitification/notificationService';
import useStyles from './styles';
import ExchangeForm from '../../../Exchange/ExchangeForm';
import axios from 'axios';
import { getUserIdFromToken } from './uti';
import PaymentForm from './PaymentFoorm';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7101';

const Product = ({ product }) => {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Invalid token:', error);
        setUserRole(null);
      }
    }
  }, []);

  const handleOpenModal = async () => {
    if (!product.inStock) {
      toast.info('This book is out of stock.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',
      });

      try {
        await notificationService.createNotification({
          message: `Notify me when ${product.titulli} is back in stock`,
          klientId: localStorage.getItem('userId'),
          bookId: product.id,
        });
        console.log('Notification created successfully');
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <style>
        {`
          .custom-toast {
            background-color: #001524 !important;
            color: white !important;
            font-size: 14px !important;
            border-radius: 8px !important;
          }
        `}
      </style>

      <div className={classes.cardContainer}>
        <Card className={classes.card}>
          <Link to={`product-view/${product.id}`} className={classes.link}>
            <div className={classes.imageContainer}>
              <CardMedia
                component="img"
                alt={product.titulli}
                height="140"
                image={product.profilePictureUrl || 'defaultProfilePic.jpg'}
                title={product.titulli}
                className={classes.image}
              />
            </div>
            <CardContent className={classes.cardContent}>
              <Typography
                variant="h6"
                component="h2"
                style={{ color: '#001524' }}
                align="center"
                className={classes.title}
              >
                {product.titulli || 'No Title'}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" align="center">
                Zhanri: {product.zhanri?.emri || 'N/A'}
                <br />
                <Chip
                  label={product.inStock ? 'In Stock' : 'Out of Stock'}
                  className={`${classes.chip} ${
                    product.inStock ? classes.inStock : classes.outOfStock
                  }`}
                />
              </Typography>
            </CardContent>
          </Link>
          <CardContent className={classes.cardContent}>
            <div className={classes.buttonContainer}>
              {userRole === 'user' && (
                <>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#001524', color: '#fff' }}
                    onClick={handleOpenModal}
                    className={classes.exchangeButton}
                  >
                    Exchange
                  </Button>
                 
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <ExchangeForm open={showModal} onClose={handleCloseModal} libriId={product.id} />
        <ToastContainer />
      </div>
    </>
  );
};

export default Product;
