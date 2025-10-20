import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography, 
  FormHelperText, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Box 
} from '@material-ui/core';
import InputMask from 'react-input-mask';  

const PaymentForm = ({ open, onClose, onConfirm }) => {
  const [amount, setAmount] = useState(10); 
  const [paymentDate, setPaymentDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState('pm_card_visa'); 
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [amountError, setAmountError] = useState('');

  const paymentMethods = [
    { id: 'pm_card_visa', label: 'Visa (Test Card)' },
    { id: 'pm_card_mastercard', label: 'Mastercard (Test Card)' },
    { id: 'pm_card_amex', label: 'American Express (Test Card)' },
  ];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
   
  ];

  const regions = {
    'US': ['California', 'New York', 'Texas', 'Florida'],  
    'CA': ['Ontario', 'Quebec', 'British Columbia'],  
  };

  useEffect(() => {
    if (open) {
      const currentDate = new Date();
      const validUntilDate = new Date(currentDate);
      validUntilDate.setFullYear(currentDate.getFullYear() + 1);

      setPaymentDate(currentDate.toISOString().slice(0, 16));
      setValidUntil(validUntilDate.toISOString().slice(0, 16)); 
    }
  }, [open]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value <= 0) {
      setAmountError('Amount must be a positive value.');
    } else {
      setAmountError('');
    }
    setAmount(value);
  };

  const handleConfirm = () => {
    if (amountError || amount <= 0 || !cardNumber || !cardholderName || !country || !region) return;

    const paymentDetails = {
      amount,
      paymentDate,
      validUntil,
      stripePaymentMethodId, 
      cardNumber, 
      cardholderName, 
      country, 
      region, 
    };

    onConfirm(paymentDetails);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center" sx={{ fontWeight: 600, color: '#333', fontSize: '1.75rem' }}>
        Payment Form
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 3 }}>
        <Typography variant="body2" color="textSecondary" paragraph sx={{ fontSize: 16, lineHeight: 1.6 }}>
          Provide your payment details below:
        </Typography>

        {/* Amount Field */}
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          fullWidth
          margin="normal"
          error={Boolean(amountError) || amount <= 0}
          helperText={amountError || (amount <= 0 ? 'Amount must be greater than 0' : 'Enter the payment amount in USD')}
          InputProps={{
            startAdornment: <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>$</Typography>,
          }}
          sx={{
            marginBottom: 3,
            borderRadius: 12,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: 12,
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />

        {/* Cardholder Name Field */}
        <TextField
          label="Cardholder Name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          fullWidth
          margin="normal"
          error={!cardholderName}
          helperText={!cardholderName ? 'Cardholder name is required' : ''}
          sx={{
            marginBottom: 3,
            borderRadius: 12,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: 12,
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />

        {/* Card Number Field with Mask */}
        <InputMask
          mask="9999 9999 9999 9999"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          maskChar=" "
        >
          {() => (
            <TextField
              label="Card Number"
              fullWidth
              margin="normal"
              error={!cardNumber}
              helperText={!cardNumber ? 'Please enter a valid card number' : ''}
              sx={{
                marginBottom: 3,
                borderRadius: 12,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: 12,
                    borderColor: '#ddd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          )}
        </InputMask>

        {/* Payment Date Field */}
        <TextField
          label="Payment Date"
          type="datetime-local"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            marginBottom: 3,
            borderRadius: 12,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: 12,
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />

        {/* Valid Until Field */}
        <TextField
          label="Valid Until"
          type="datetime-local"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            marginBottom: 3,
            borderRadius: 12,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: 12,
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />

        {/* Stripe Payment Method Field */}
        <FormControl fullWidth margin="normal" sx={{ marginBottom: 3 }}>
          <InputLabel>Stripe Payment Method</InputLabel>
          <Select
            value={stripePaymentMethodId}
            onChange={(e) => setStripePaymentMethodId(e.target.value)}
            label="Stripe Payment Method"
            sx={{
              borderRadius: 12,
              '& .MuiSelect-root': {
                paddingRight: '2rem',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: 12,
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.id} value={method.id}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  💳 {method.label}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          <FormHelperText sx={{ fontSize: 12, color: 'text.secondary' }}>
            Choose a payment method. These are test cards.
          </FormHelperText>
        </FormControl>

        {/* Country Field */}
        <FormControl fullWidth margin="normal" sx={{ marginBottom: 3 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            label="Country"
            sx={{
              borderRadius: 12,
              '& .MuiSelect-root': {
                paddingRight: '2rem',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: 12,
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Region Field */}
        <FormControl fullWidth margin="normal" sx={{ marginBottom: 3 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            label="Region"
            sx={{
              borderRadius: 12,
              '& .MuiSelect-root': {
                paddingRight: '2rem',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: 12,
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
            disabled={!country} 
          >
            {country && regions[country] && regions[country].map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" color="textSecondary" paragraph sx={{ fontSize: 16 }}>
          Please review the details before confirming the payment.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 3, paddingTop: 0 }}>
        <Button onClick={onClose} color="secondary" variant="outlined" sx={{
          width: 130, 
          fontWeight: 'bold', 
          borderRadius: 12, 
          letterSpacing: 1, 
          textTransform: 'none',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: '#f1f1f1',
          }
        }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          disabled={Boolean(amountError) || amount <= 0 || !cardNumber || !cardholderName || !country || !region}
          sx={{
            width: 170,
            fontWeight: 'bold',
            letterSpacing: 1.2,
            textTransform: 'none',
            backgroundColor: '#1976d2',
            borderRadius: 12,
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentForm;
