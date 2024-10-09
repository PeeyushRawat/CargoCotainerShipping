import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import './payment.css'
import { useDispatch, useSelector } from 'react-redux'
import { removeContainerFromCart } from '../../actions/bookingActions'
import { createOrder } from '../../actions/orderActions';

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [errors, setErrors] = useState({});
  const [isPaymentStep, setIsPaymentStep] = useState(false);  // Added to toggle between cost view and payment step

  const { user, loading } = useSelector(state => state.auth)
  const { containerId, locationId, destinationId, availableFrom, price } = useSelector(state => state.containerSelected);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const unformattedCardNumber = cardNumber.replace(/\s/g, ''); // remove spaces for validation
    if (!/^\d{16}$/.test(unformattedCardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    if (!cardHolderName) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }
    return newErrors;
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      // Handle payment logic
      console.log('Form submitted:', { cardNumber, expiryDate, cvv, cardHolderName });
      handleBook();
    } else {
      setErrors(formErrors);
    }
  };

  // Handle booking and order creation
  const handleBook = async () => {
    try {
      dispatch(createOrder({
        userId: user.id,
        containerId,
        sourcePortId: locationId,
        destinationPortId: destinationId,
        shippingDate: availableFrom
      }));

      navigate('/payment/confirm');
    } catch (err) {
      alert(`Failed to book container ${containerId}. Please try again.`);
    }
  };

  useEffect(() => {
    if (!containerId) {
      alert('Login and select a container to access this page');
      navigate('/');
    }
  }, [dispatch, containerId, navigate]);

  // Function to handle when the user clicks "Proceed to Payment"
  const handleProceedToPayment = () => {
    setIsPaymentStep(true);
  };

  return (
    <div className="payment-page-container">
      <div className="payment-card">
        {!isPaymentStep ? (
          <>
          <div className='cost'>
              {/* Display Cost and Proceed Button */}
              <h2>TOTAL COST OF YOUR CONTAINERS BOOKED</h2>
            <div className="cost-display">
              <p><strong>Container Number:</strong> {containerId}</p>
              {/* <p><strong>Source Port ID:</strong> {locationId}</p>
              <p><strong>Destination Port ID:</strong> {destinationId}</p> */}
              <p><strong>Available From:</strong> {availableFrom}</p>
              <p><strong>Total Cost:</strong> ${price}</p>
            </div>
            <button className="proceed-btn" onClick={handleProceedToPayment}>Proceed to Payment</button>
          </div>
          </>
        ) : (
          <>
            {/* Payment Form */}
            <h2>Complete Your Payment</h2>
            <form className="payment-form" onSubmit={handleSubmit}>

              {/* Cardholder Name */}
              <div className="form-group">
                <label htmlFor="cardHolderName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                 
                />
                {errors.cardHolderName && <span className="errorr">{errors.cardHolderName}</span>}
              </div>

              {/* Card Number */}
              <div className="form-group">
  <label htmlFor="cardNumber">Card Number</label>
  <input
    type="text"
    id="cardNumber"
    name="cardNumber"
    value={cardNumber}
    placeholder="1234 1234 1234 1234"
    maxLength="19" // 16 digits + 3 spaces
    onChange={(e) => {
      const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
      const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
      setCardNumber(formattedValue);
    }}
  />
  {errors.cardNumber && <span className="errorr">{errors.cardNumber}</span>}
</div>
              {/* Expiry Date */}
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  
                  maxLength="5"
                />
                {errors.expiryDate && <span className="errorr">{errors.expiryDate}</span>}
              </div>

              {/* CVV */}
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  maxLength="4"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                 
                />
                {errors.cvv && <span className="errorr">{errors.cvv}</span>}
              </div>

              <button type="submit" className="submit-btn">Submit Payment</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
