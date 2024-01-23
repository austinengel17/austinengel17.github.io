import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";

import '../Navbar.css'; // Import your CSS file
const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
  }

  return (
    <nav className="navbar">
      <ul className={`navbar-links ${showDropdown ? 'show' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <div className="border"></div>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
      <div className="dropdown-toggle" onClick={handleDropdownToggle}>
        <img src={process.env.PUBLIC_URL + '/hamburger.png'} alt="Icon"/>
      </div>
      {/* Right-aligned icon */}
        <div className="right-icon">
            <a target="_blank" href="https://github.com/austinengel17"><img src={process.env.PUBLIC_URL + '/github-mark/github-mark-white.png'} alt="Icon" /></a>
        </div>
    </nav>
  );
};

export default Navbar;