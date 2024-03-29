import './App.css';
import Header from './Header.js';
import Map from'./mbta-tracker/Map.js';
import Home from './components/Home.js';
import Navbar from './components/Navbar.js';
import About from './components/About.js';
import Contact from './components/Contact.js';
import Dashboard from './dashboard/Dashboard.js';


import {HashRouter as Router, Routes, Route,} from "react-router-dom";

function App() {
return (
     <Router>
          <>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/map" element={<div id="body"><Header /><Map /></div>} />
              <Route path="/dashboard" element={<Dashboard/>} />
            </Routes>
          </>
    </Router>
  );
}

export default App;
