import React from 'react';
import { useNavigate } from 'react-router-dom'; // To fetch the passed props
import './confirm.css'; // Import the CSS file

import { useDispatch, useSelector } from 'react-redux'
import { removeContainerFromCart } from '../../actions/bookingActions';

const ConfirmationPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.auth)
    const { containerId, locationId, destinationId, availableFrom, price } = useSelector(state => state.containerSelected);
    const type = 'Gas Container';
    const size = 20;

    const Ports = [
        'Nhava Sheva',
        'Mumbai Port',
        'Chennai Port',
        'Ennore Port',
        'Kolkata Port',
        'Haldia Port',
        'Cochin Port',
        'Mundra Port',
        'Kandla Port',
        'Vishakhapatnam Port'
    ]
    
    const ShippingCompanies = [
        'ABS Marine',
        'Evergreen Line',
        'ONE Ocean Network Express',
        'OOCL',
        'Essar Shipping'
    ]

    return (
        <div className="confirmation-page">
            <div className="confirmation-container">
                <img src="/images/tick.jpg" alt="Success" className="success-icon" />
                <h1>Booking Confirmed!</h1>
                <p>Your container has been successfully booked.</p>
                <h2 className='hello'>CHECK YOUR EMAIL FOR CONFIRMATION</h2>
                <div className="container-details">
                    {/* Removed the Container ID */}
                    <div className="detail-item">
                        <h2>Type</h2>
                        <p>{type}</p>
                    </div>
                    <div className="detail-item">
                        <h2>Size</h2>
                        <p>{size}</p>
                    </div>
                    <div className="detail-item">
                        <h2>Source Port</h2>
                        <p>{Ports[locationId-1]}</p>
                    </div>
                    <div className="detail-item">
                        <h2>Destination Port</h2>
                        <p>{Ports[destinationId-1]}</p>
                    </div>
                    <div className="detail-item">
                        <h2>Available From</h2>
                        <p>{availableFrom}</p>
                    </div>
                    <div className="detail-item">
                        <h2>Amount Paid</h2>
                        <p>{price}</p>
                    </div>
                </div>

                <button className="home-button" onClick={() => {navigate('/orders'); dispatch(removeContainerFromCart());}}>
                    Check Orders
                </button>
                <button className="home-buttonn" onClick={() => { navigate('/'); dispatch(removeContainerFromCart()); }}>
                    Go Back Home
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;
