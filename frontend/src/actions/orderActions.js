import axios from 'axios'

import {    
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    CLEAR_ERRORS
} from '../constants/orderConstants'

export const createOrder = (order) => async (dispatch, getState) => {
    try {

        dispatch({ type: CREATE_ORDER_REQUEST })

        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('https://localhost:7240/api/Booking/book', order, config)

        //const price = await axios.get(`https://localhost:7240/api/Booking/price?containerId=${order.}&destinationPortId=3`);

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get curretly logged in user orders
export const myOrders = (userId) => async (dispatch) => {
    try {
        
        dispatch({ type: MY_ORDERS_REQUEST });

        // // Make GET request with query parameters
        // const { data } = await axios.get('https://localhost:7240/api/Booking/GetBookingDetails', {
        //     params: {
        //         userId : userId
        //     }
        // });
        const { data } = await axios.get(`https://localhost:7240/api/Booking/GetBookingDetails/${userId}`);

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })    
 }