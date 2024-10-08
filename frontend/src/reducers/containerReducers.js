import {    
    NEW_CONTAINER_REQUEST,
    NEW_CONTAINER_SUCCESS,
    NEW_CONTAINER_FAIL,
    NEW_CONTAINER_RESET,
    ALL_CONTAINER_REQUEST,
    ALL_CONTAINER_SUCCESS,
    ALL_CONTAINER_FAIL,
    CLEAR_ERRORS
} from '../constants/containerConstants'

export const newContainerReducer = (state = { container: {} }, action) =>{
    switch (action.type) {

        case NEW_CONTAINER_REQUEST:
            return {
                ...state,
                loading: true
            }
        
        case NEW_CONTAINER_SUCCESS:
            return {
                loading: false,
                success: true,
                container: action.payload
            }

        case NEW_CONTAINER_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_CONTAINER_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}


export const allContainerReducer = (state = { containers: [] }, action) => {
    switch (action.type) {

        case ALL_CONTAINER_REQUEST:
            return {
                loading: true
            }

        case ALL_CONTAINER_SUCCESS:
            return {
                loading: false,
                containers: action.payload
            }

        case ALL_CONTAINER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}