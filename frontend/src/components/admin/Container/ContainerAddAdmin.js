import './ContainerAddAdmin.css'; // Import the CSS file for styling
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { newContainer, clearErrors } from '../../../actions/containerActions'
import { useNavigate } from 'react-router-dom'
import { NEW_CONTAINER_RESET } from '../../../constants/containerConstants';
import { allPorts } from '../../../actions/portActions';

const ContainerAddAdmin = () => {
    const [size, setSize] = useState('');
    const [sizeQuantity, setSizeQuantity] = useState();
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [sourcePort, setSourcePort] = useState('');
    const [sourcePortId, setSourcePortId] = useState();
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState();
    const [availableFrom, setAvailableFrom] = useState('');

    const { ports = [] } = useSelector(state => state.allPorts);

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

    const ContainerTypes = [
        'Dry containers',
        'Reefer containers',
        'Flat rack containers',
        'Open top containers',
        'Tank containers'
    ]

    const containerStandardSizes = [
        '20FT General',
        '20FT High Cube',
        '40FT General',
        '40FT High Cube'
    ]

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector(state => state.newContainer);

    useEffect(() => {

        dispatch(allPorts());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (success) {
            navigate('/');
            alert('Container created successfully');
            dispatch({ type: NEW_CONTAINER_RESET })
        }
    }, [dispatch, error, success])

    const handleSubmit = (e) => {
        e.preventDefault();

        // You can add your API call here to submit the data
        let container = {
            size : 40,
            type,
            currentPortId : sourcePortId,
            shippingCompanyId : companyId,
            capacity,
            availableFrom
        };
        
        dispatch(newContainer(container));
    };

    const handleCompanyName = (e) => {
        setCompanyName(e.target.value);
        setCompanyId(e.target.selectedIndex);
    }

    const handlePortLocation = (e) => {
        setSourcePort(e.target.value);
        setSourcePortId(e.target.selectedIndex);
    }

    return (
        <div className="add-container-form">
            <h1>Add Container</h1>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Company Name:</label>
                    <select
                        value={companyName}
                        onChange={handleCompanyName}
                    >
                        <option value="" disabled hidden>Select Your Company</option>
                        {ShippingCompanies.map((ShippingCompany, index) => (
                            <option key={index + 1} value={ShippingCompany}>
                                {ShippingCompany}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Type:</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="" disabled hidden>Select Type of Container</option>
                        {ContainerTypes.map((ContainerType, index) => (
                            <option key={index + 1} value={ContainerType}>
                                {ContainerType}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Size:</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    >
                        <option value="" disabled hidden>Select Size of Container</option>
                        {containerStandardSizes.map((containerStandardSize, index) => (
                            <option key={index + 1} value={containerStandardSize}>
                                {containerStandardSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Source Port:</label>
                    <select
                        value={sourcePort}
                        onChange={handlePortLocation}
                    >
                        <option value="" disabled hidden>Select Port Location</option>
                        {Ports.map((port, index) => (
                            <option key={index + 1} value={port}>
                                {port}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Available For Booking:</label>

                    <input
                        type="date"
                        value={availableFrom}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Capacity:</label>
                    <input
                        type='number'
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='ac'>Add Container</button>
            </form>
        </div>
    );
};

export default ContainerAddAdmin;