import logo from './logo.svg';
import './App.css';
import Header from './Header.js';
import Map from'./components/Map.js';
import Home from './components/Home.js';
import Navbar from './components/Navbar.js';
import About from './components/About.js';

import {BrowserRouter as Router, Routes, Route,} from "react-router-dom";

function App() {
return (
     <Router>
          <>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/map" element={<div id="body"><Header /><Map /></div>} />
            </Routes>
          </>
    </Router>
  );
}

export default App;
