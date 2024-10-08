import axios from 'axios'

import {    
    ALL_PORTS_REQUEST,
    ALL_PORTS_SUCCESS,
    ALL_PORTS_FAIL,
    
    CLEAR_ERRORS
} from '../constants/portConstants'

 //Get all Ports
 export const allPorts = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_PORTS_REQUEST });

        const { data } = await axios.get(`https://localhost:7240/api/Port`)

        dispatch({
            type: ALL_PORTS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_PORTS_FAIL,
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