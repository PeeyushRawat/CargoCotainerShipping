import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllContainers.css'; // Import the CSS file
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'react-bootstrap';
import { clearErrors, allContainer } from '../../../actions/containerActions';
import { allPorts } from '../../../actions/portActions';

const AllContainers = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth)
    const { loading, error, containers = [] } = useSelector(state => state.allContainers);
    const { ports = [] } = useSelector(state => state.allPorts);

    useEffect(() => {
        dispatch(allContainer());
        dispatch(allPorts());

        if (error) {
            // alert.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch,  error])

    // Function to format DateOnly strings
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle empty or undefined date
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format date as needed (e.g., MM/DD/YYYY)
    };

    return (
        <div className="containerr">
            <div className="background"></div> {/* Background image */}
            <h3 className="text-white">All Containers</h3>

            {/* Error message */}
            {error && <p className="text-danger">{error}</p>}

            {/* Conditionally render table only after search and if data exists */}
            {containers.length > 0 && (
                <Table striped bordered hover responsive className="booking-table">
                    <thead>
                        <tr>
                            <th>Container ID</th>
                            <th>Container Type</th>
                            <th>Container Size</th>
                            <th>Current Port</th>
                            <th>Shipping Company</th>
                            <th>Availabe From</th>
                        </tr>
                    </thead>
                    <tbody>
                        {containers.map((container) => (
                            <tr key={container.id}>
                                <td>{container.id}</td>
                                <td>{container.type}</td>
                                <td>{container.size}</td>
                                <td>{container.currentPortId}</td>
                                <td>{container.shippingCompanyId}</td>
                                <td>{formatDate(container.availableFrom)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* No orders found message */}
            {containers.length === 0 && !loading && (
                <p className="text-center text-white">No containers Listed.</p>
            )}
        </div>
    );
};

export default AllContainers;
