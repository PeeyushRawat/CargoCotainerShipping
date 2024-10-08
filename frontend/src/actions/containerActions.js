import axios from 'axios'

import {    
    NEW_CONTAINER_REQUEST,
    NEW_CONTAINER_SUCCESS,
    NEW_CONTAINER_FAIL,
    ALL_CONTAINER_REQUEST,
    ALL_CONTAINER_SUCCESS,
    ALL_CONTAINER_FAIL,
    CLEAR_ERRORS
} from '../constants/containerConstants'

// Add Container (Admin)
export const newContainer = (containerData) => async(dispatch) => {
    try {

        dispatch({ type: NEW_CONTAINER_REQUEST })

        const config = {
            Headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`https://localhost:7240/api/Containers/admin/newContainer`, containerData, config)
        
        dispatch({
            type: NEW_CONTAINER_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: NEW_CONTAINER_FAIL,
            payload: error.response.data.message
        })
    }
 }

 //Get all Container - (ADMIN)
 export const allContainer = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_CONTAINER_REQUEST });

        const { data } = await axios.get(`https://localhost:7240/api/Containers/admin/containers`)

        dispatch({
            type: ALL_CONTAINER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_CONTAINER_FAIL,
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