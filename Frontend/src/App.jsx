import "./App.css";

import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BikeInUse from "./pages/BikeInUse";
import ParkingStatus from "./pages/ParkingStatus";
import History from "./pages/History";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bike-in-use" element={<BikeInUse />} />
        <Route path="/parking-status" element={<ParkingStatus />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
export default App;
