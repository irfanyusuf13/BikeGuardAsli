import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BikeInUse from "./pages/BikeInUse";
import ParkingStatus from "./pages/ParkingStatus";
import History from "./pages/History";
import AdminPage from "./pages/AdminPage";
import AdminManageParking from "./pages/AdminManageParking";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bike-in-use" element={<BikeInUse />} />
        <Route path="/parking-status" element={<ParkingStatus />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-manage-parking" element={<AdminManageParking />} />
      </Routes>
    </Router>
  );
}

export default App;
