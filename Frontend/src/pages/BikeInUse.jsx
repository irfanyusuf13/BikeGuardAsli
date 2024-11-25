import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BikeInUse = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [parkingSlot, setParkingSlot] = useState(null);
  const [location, setLocation] = useState("");
  const [username, setUsername] = useState("Guest");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const slotId = localStorage.getItem("parkingSlotId");
    const id = localStorage.getItem("userId");

    if (name) setUsername(name);
    if (slotId) {
      setParkingSlot(slotId);
      fetchParkingSlotDetails(slotId);
    }
    if (id) setUserId(id);
    setLoading(false);
  }, []);

  const fetchParkingSlotDetails = async (slotId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/parking-slot/${slotId}`
      );
      const slotData = response.data.data;

      if (slotData) {
        setLocation(slotData.location);
        setIsUnlocked(slotData.status === "Available");
      } else {
        setMessage("Parking slot details not found.");
      }
    } catch (error) {
      console.error("Error fetching parking slot details:", error);
      setMessage("Failed to fetch parking slot details.");
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Error locking bike:", error);
      setMessage("An error occurred while locking the bike. Please try again.");
    }
  };

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
        await fetchParkingSlotDetails(parkingSlot);
      } else {
        setMessage(response.data.message || "Failed to unlock bike.");
      }
    } catch (error) {
      console.error("Error unlocking bike:", error);
      setMessage("An error occurred while unlocking the bike. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <p className="text-white text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col">
      {/* Header */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow-md border-b border-blue-500">
        <h2 className="text-2xl font-bold text-blue-600">BikeGuard</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png"
              alt="User Icon"
              className="w-6 h-6"
            />
            <span className="font-semibold">{username}</span>
          </div>
          <Link
            to="/history"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            History
          </Link>
          <Link
            to="/home"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-white">
        <img
          src={
            isUnlocked
              ? "https://img.icons8.com/ios-filled/100/4CAF50/unlock--v1.png"
              : "https://img.icons8.com/ios-filled/100/FF5252/lock--v1.png"
          }
          alt="Lock Icon"
          className="mb-6"
        />
        <p className="text-center font-bold text-xl mb-2">
          {parkingSlot
            ? `Your bike is parked at slot: ${parkingSlot}`
            : "No parking slot information available."}
        </p>
        {location && (
          <p className="text-center text-lg mb-4">Location: {location}</p>
        )}

        {isUnlocked ? (
          <button
            onClick={handleLock}
            className="px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition"
          >
            LOCK
          </button>
        ) : (
          <button
            onClick={handleUnlock}
            className="px-8 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition"
          >
            UNLOCK
          </button>
        )}

        {message && (
          <p className="mt-6 text-center text-yellow-300 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BikeInUse;
