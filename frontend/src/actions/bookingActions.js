import axios from 'axios';

import {
    SELECT_CONTAINER,
    REMOVE_CONTAINER,
    CLEAR_ERRORS
} from '../constants/bookingConstants';


export const addContainerToCart = (containerId, locationId, destinationId, availableFrom) => async (dispatch) => {
    
    const { data } = await axios.get(`https://localhost:7240/api/Booking/price?containerId=${containerId}&destinationPortId=${destinationId}`);
    console.log(data.price);
    dispatch({
        type: SELECT_CONTAINER,
        payload: {
            containerId,
            locationId, 
            destinationId, 
            availableFrom,
            price : data.price
        }
    })

}

export const removeContainerFromCart = () => async (dispatch) => {

    dispatch({
        type: REMOVE_CONTAINER
    })

}