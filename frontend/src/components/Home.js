import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="homepage-container">
      
      {/* Background Video Container */}
      <div className="video-container">
        <video autoPlay loop muted className="background-video">
          <source src='images/v4.mp4' type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    
      {/* Navbar Container */}
      
      <div className="overlay-text">
        <h1>Welcome to U.S WEST CARGO Logistics</h1>
        <p>We specialize in providing efficient, reliable, and secure cargo solutions across the globe. Our key services include international freight forwarding by air, sea, and land, warehousing and distribution, real-time cargo tracking, and customized supply chain solutions. At WhiteCargo, we are committed to delivering your cargo on time, every time. Whether you're shipping across continents or locally, we've got you covered.</p>
        <Link to="/book-cargo">
          <button id="btn" className="btn btn-long">Book for Cargo</button>
        </Link>
    </div>
    
   
    </div>

   
  );
};

export default Home;
