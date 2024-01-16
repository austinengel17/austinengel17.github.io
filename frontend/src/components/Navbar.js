import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css'; // Import your CSS file
const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/map">Map</Link></li>
      </ul>

      {/* Right-aligned icon */}
        <div className="right-icon">
            <a target="_blank" href="https://github.com/austinengel17"><img src={process.env.PUBLIC_URL + '/github-mark/github-mark.png'} alt="Icon" /></a>
        </div>
    </nav>
  );
};

export default Navbar;