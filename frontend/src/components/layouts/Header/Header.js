import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../actions/userActions'

const Header = () => {

  const dispatch = useDispatch();

  const { isAuthenticated, error, loading } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.auth)

  const logoutHandler = () => {
    dispatch(logout());
    // alert.success('Logged out successfully.')
  }

  return (
    <div className="homepage-container">

      {/* Navbar Container */}
      <nav className="navbar navbar-expand-lg sticky-top custom-navbar">
        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"    // Bootstrap 5 uses "data-bs-toggle"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Nav Links */}
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>

            <li className="nav-item">
              <Link to="/about" className="nav-link">About Us</Link>
            </li>

            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>

            <li className="nav-item">
              <Link to="/partners" className="nav-link">PARTNERS WITH U.S WEST CARGO</Link>
            </li>
            <li className="nav-item">
              <Link target="_blank" to="http://localhost:3002/" className="nav-link">Prudent AI</Link>
            </li>
          </ul>

        </div>

        {user ? (
          <div className="ml-4 dropdown d-inline">
            <button
              className="btn btn-long mt-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>{user && user.name}</span>
            </button>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {user && user.role === 'admin' && (
                <>
                  <li>
                    <Link className="dropdown-item" to="/admin/containers">Add Container</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/allcontainers">View All Containers</Link>
                  </li>
                </>

              )}
              <li>
                <Link className="dropdown-item" to="/orders">Orders</Link>
              </li>
              {/* <li>
                <Link className="dropdown-item" to="/me">Profile</Link>
              </li> */}
              <li>
                <button className="dropdown-item text-danger" onClick={logoutHandler}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          !loading && <Link to="/login" className="btn btn-long">Log in</Link>
        )}


        {/* Logo */}
        <Link to="/"> {/* Using Link to navigate to home page when image is clicked */}
          <img src='/images/logo4.png' className="img-fluid custom-logo" alt="Logo" />
        </Link>
      </nav>
    </div>
  );
};

export default Header;
