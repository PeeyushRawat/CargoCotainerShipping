import React, { useState } from 'react';
import axios from 'axios';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import {addContainerToCart} from '../../actions/bookingActions'
import './ContainerAvailability.css'; // Import the CSS file

const ContainerAvailability = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [location, setLocation] = useState('');
    const [locationId, setLocationId] = useState(0);
    const [destination, setDestination] = useState('');
    const [destinationId, setDestinationId] = useState(0);
    const [availableFrom, setAvailableFrom] = useState('');
    const [containers, setContainers] = useState([]);
    // const [selectedContainer, setSelectedContainer] = useState();
    const [error, setError] = useState('');

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

    // Format the date as YYYY-MM-DD for the backend
    const formatDate = (date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    const handleSearch = async () => {
        try {
            // Format date for the API
            const formattedDate = availableFrom ? formatDate(availableFrom) : '';

            // Make GET request with query parameters
            const response = await axios.get('https://localhost:7240/api/Containers/available', {
                params: {
                    portId:locationId, // Pass as query param
                    availableFrom: formattedDate // Pass the formatted date
                }
            });

            setContainers(response.data);
            setError('');
        } catch (err) {
            setError('No containers available for the specified location and date.');
            setContainers([]);
        }
    };

    const handlePortLocation = (e) => {
        setLocation(e.target.value);
        setLocationId(e.target.selectedIndex);
    }

    const handlePortDestination = (e) => {
        setDestination(e.target.value);
        setDestinationId(e.target.selectedIndex);
    }

    
    const handleBook = async (containerId, locationId, destinationId, availableFrom) => {
        dispatch(addContainerToCart(containerId, locationId, destinationId, availableFrom))
        navigate({
            pathname: '/login',
            search: `?${createSearchParams({
                redirect: 'payment'
            })}`
        })
    };

    return (
        <div className="container-availability">
           
            <div className="overlay"></div>
            <div className="form-containery">
                <h1>Check Container Availability</h1>
                <select
                    value={location}
                    onChange={handlePortLocation}
                >
                    <option value="" disabled hidden>Select Port Location</option>
                    {Ports.map((port, index) => (
                        <option key={index+1} value={port}>
                            {port}
                        </option>
                    ))}
                </select>
                <select
                    value={destination}
                    onChange={handlePortDestination}
                >
                    <option value="" disabled hidden>Select Port Destination</option>
                    {Ports.map((port, index) => (
                        <option key={index+1} value={port}>
                            {port}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="container-list">
                {containers.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Location</th>
                                <th>Available From</th>
                                <th>Book</th>
                            </tr>
                        </thead>
                        <tbody>
                            {containers.map(container => (
                                <tr key={container.id}>
                                    <td>{container.id}</td>
                                    <td>{container.type}</td>
                                    <td>{container.size}</td>
                                    <td>{Ports[container.currentPortId-1]}</td>
                                    <td>{container.availableFrom}</td>
                                    <td>
                                        <button onClick={(e) => handleBook(container.id, locationId, destinationId, availableFrom)}>
                                            Book
                                        </button>
                                    </td> {/* Add the Book button in each row */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ContainerAvailability;