import React from 'react';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AboutUs from './components/AboutUs/AboutUs';
import Root from './Root';
import ContactUs from './components/ContactUs/ContactUs';
import Home from './components/Home';
import Partner from './components/Partner/Partner';
import ContainerAvailability from './components/ContainerAvailability/ContainerAvailability';
import PaymentForm from './components/Payment/payment';
import AuthForm from './components/Auth/Login';
import RegisterForm from './components/Auth/Register';
import BookedContainers from './components/Orders/Orders';
import ForgotPassword from './components/Auth/ForgotPassword'
import ResetPassword from './components/Auth/ResetPassword'
import ConfirmationPage from './components/Payment/confirm';
import ContainerAddAdmin from './components/admin/Container/ContainerAddAdmin';
import ProtectedRoute from './components/route/ProtectedRoute';
import AllContainers from './components/admin/Container/AllContainers';


const routerr = createBrowserRouter([
  {
    path: '/',
    element: <Root />,  // Main layout or container (could include Navbars, etc.)
    children: [
      { path: 'partners', element: <Partner /> },  // Partners Page route
      { path: 'about', element: <AboutUs /> },  // About Us Page route
      { path: 'contact', element: <ContactUs /> },
      { path: '/', element: <Home /> },

      { path: 'book-cargo', element: <ContainerAvailability /> },
      { path: 'payment', element: <PaymentForm /> },
      { path: 'payment/confirm', element: <ConfirmationPage /> },
      { path: 'login', element: <AuthForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'orders', element: <BookedContainers /> },
      { path: 'password/forgot', element: <ForgotPassword /> },
      { path: 'password/reset/:token', element: <ResetPassword /> },

      {
        path: 'admin/containers', element:
          <ProtectedRoute>
            <ContainerAddAdmin />
          </ProtectedRoute>
      },

      {
        path: 'admin/allcontainers', element:
          <ProtectedRoute>
            <AllContainers />
          </ProtectedRoute>
      },


    ],
  },
]);

function App() {
  return (
    <div className="App">
      {/* RouterProvider to manage the routing */}
      <RouterProvider router={routerr} />
    </div>


  );
}

export default App;
