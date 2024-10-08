import {    
    ALL_PORTS_REQUEST,
    ALL_PORTS_SUCCESS,
    ALL_PORTS_FAIL,
    
    CLEAR_ERRORS
} from '../constants/portConstants'

export const allPortsReducer = (state = { ports: [] }, action) => {
    switch (action.type) {

        case ALL_PORTS_REQUEST:
            return {
                loading: true
            }

        case ALL_PORTS_SUCCESS:
            return {
                loading: false,
                ports: action.payload
            }

        case ALL_PORTS_FAIL:
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