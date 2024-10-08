import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import { authReducer, forgotPasswordReducer
    // ,userReducer 
    } from './reducers/userReducers';
import { bookingReducer } from './reducers/bookingReducers';
import { myOrdersReducer, newOrderReducer } from './reducers/orderReducers';
import { allContainerReducer, newContainerReducer } from './reducers/containerReducers';
import { allPortsReducer } from './reducers/portReducers';


// Combine all reducers
const rootReducer = combineReducers({
    auth: authReducer, 
    newContainer: newContainerReducer,    
    // user: userReducer  
    newOrder: newOrderReducer,
    containerSelected: bookingReducer,
    myOrders: myOrdersReducer,
    allContainers: allContainerReducer,
    allPorts: allPortsReducer,
    forgotPassword: forgotPasswordReducer
});

// Initial state of the store
const initialState = {
    auth: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    }
};

// Middleware setup
const middleware = [thunk];

// Create Redux store
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
