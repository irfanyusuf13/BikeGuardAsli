import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BikeInUse = () => {
  const [isUnlocked, setIsUnlocked] = useState(false); // Status sepeda terkunci/tidak
  const [parkingSlot, setParkingSlot] = useState(null); // ID slot parkir
  const [location, setLocation] = useState(""); // Lokasi slot parkir
  const [username, setUsername] = useState("Guest"); // Nama pengguna
  const [status, setStatus] = useState(""); // Status slot parkir
  const [message, setMessage] = useState(""); // Pesan untuk pengguna
  const [loading, setLoading] = useState(true); // Status loading
  const [userId, setUserId] = useState(null); // ID pengguna

  useEffect(() => {
    // Ambil data pengguna dan slot parkir dari localStorage
    const name = localStorage.getItem("userName");
    const slotId = localStorage.getItem("parkingSlotId");
    const id = localStorage.getItem("userId"); // Ambil userId

    if (name) setUsername(name);
    if (slotId) {
      setParkingSlot(slotId);
      fetchParkingSlotDetails(slotId); // Ambil detail slot parkir
    }
    if (id) setUserId(id);
    setLoading(false); // Selesai loading data lokal
  }, []);

  // Fetch detail slot parkir dari backend
  const fetchParkingSlotDetails = async (slotId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/parking-slot/${slotId}`
      );
      const slotData = response.data.data;

      if (slotData) {
        setLocation(slotData.location);
        setStatus(slotData.status); // Set status slot (Available/Unavailable)
        setIsUnlocked(slotData.status === "Available");
      } else {
        setMessage("Parking slot details not found.");
      }
    } catch (error) {
      console.error("Error fetching parking slot details:", error.response?.data || error.message);
      setMessage("Failed to fetch parking slot details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle lock bike
  const handleLock = async () => {
    if (!userId) {
      setMessage("User ID not found.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/parking-slot/lock", {
        parking_slot_id: parkingSlot,
        reserved_by: userId,
      });

      if (response.data.message === "Slot parkir berhasil diparkir") {
        setMessage("Bike successfully locked.");
        await fetchParkingSlotDetails(parkingSlot);
      } else {
        setMessage(response.data.message || "Failed to lock bike.");
      }
    } catch (error) {
      console.error("Error locking bike:", error.response?.data || error.message);
      setMessage("An error occurred while locking the bike. Please try again.");
    }
  };

  // Handle unlock bike
  const handleUnlock = async () => {
    if (!parkingSlot || !userId) {
      setMessage("Parking slot or user ID not found.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/parking-slot/unlock", {
        parking_slot_id: parkingSlot,
        user_id: userId,
      });

      if (response.data.message === "Slot parkir berhasil dibatalkan") {
        setMessage("Bike successfully unlocked.");
        setIsUnlocked(true);
        setStatus("Available");
        await fetchParkingSlotDetails(parkingSlot);
      } else {
        setMessage(response.data.message || "Failed to unlock bike.");
      }
    } catch (error) {
      console.error("Error unlocking bike:", error.response?.data || error.message);
      setMessage("An error occurred while unlocking the bike. Please try again.");
    }
  };

  // Jika loading, tampilkan indikator
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-100 flex flex-col justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Render halaman utama
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 ml-4">BikeGuard</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png"
              alt="User Icon"
              className="w-6 h-6"
            />
            <span className="font-semibold">{username}</span>
          </div>
          <Link to="/history" className="text-black">
            History
          </Link>
          <Link to="/home" className="text-black">
            Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <img
          src={
            isUnlocked
              ? "https://img.icons8.com/ios-filled/100/000000/unlock--v1.png"
              : "https://img.icons8.com/ios-filled/100/000000/lock--v1.png"
          }
          alt="Lock Icon"
          className="mb-4"
        />
        <p className="text-center font-semibold mb-2">
          {parkingSlot
            ? `Your bicycle is parked at slot: ${parkingSlot}`
            : "No parking slot information available."}
        </p>
        {location && (
          <p className="text-center text-gray-600 mb-2">Location: {location}</p>
        )}

        {/* Tombol dinamis berdasarkan status */}
        {isUnlocked ? (
          <button
            onClick={handleLock}
            className="py-2 px-6 rounded-full shadow-md mb-2 bg-blue-500 text-white"
          >
            LOCK
          </button>
        ) : (
          <button
            onClick={handleUnlock}
            className="py-2 px-6 rounded-full shadow-md mb-2 bg-gray-400 text-white"
          >
            UNLOCK
          </button>
        )}

        <p className="text-gray-600">
          {isUnlocked ? "Your bike is unlocked!" : "Your bike is locked."}
        </p>

        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default BikeInUse;
