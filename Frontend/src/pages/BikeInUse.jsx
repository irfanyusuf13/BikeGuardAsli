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
    if (id) setUserId(id); // Set userId
    else setLoading(false);
  }, []);

  // Fetch detail slot parkir dari backend
  const fetchParkingSlotDetails = async (slotId) => {
    try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/parking-slot/${slotId}`);
        console.log("Detail slot parkir:", response.data.data); // Tambahkan log
        const slotData = response.data.data;

        if (slotData) {
            setLocation(slotData.location);
            setStatus(slotData.status); // Set status slot (Available/Unavailable)
            setIsUnlocked(slotData.status === "Available"); // Set kondisi sepeda
        } else {
            setMessage("Detail slot parkir tidak ditemukan.");
        }
    } catch (error) {
        console.error("Error mengambil detail slot parkir:", error.response?.data || error.message);
        setMessage("Gagal mengambil informasi slot parkir.");
    } finally {
        setLoading(false);
    }
};


  // Handle kunci sepeda
  const handleLock = async () => {
    if (!userId) {
      setMessage("User ID tidak ditemukan.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/parking-slot/lock", {
        parking_slot_id: parkingSlot,
        reserved_by: userId, // Gunakan userId
      });

      if (response.data.message === "Slot parkir berhasil diparkir") {
        setMessage("Sepeda berhasil dikunci.");
        await fetchParkingSlotDetails(parkingSlot); // Refresh status slot
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error saat mengunci sepeda:", error);
      setMessage("Terjadi kesalahan saat mengunci sepeda. Coba lagi.");
    }
  };

  // Handle buka kunci sepeda
  const handleUnlock = async () => {
    if (!parkingSlot) {
        setMessage("Slot parkir tidak terkunci atau tidak ada pemesan.");
        return;
    }

    console.log("Mengirim permintaan unlock:", {
        parking_slot_id: parkingSlot,
        user_id: userId,
    });

    try {
        const response = await axios.post("http://localhost:3000/parking-slot/unlock", {
            parking_slot_id: parkingSlot,
            user_id: userId, // Gunakan userId
        });

        console.log("Respons dari server:", response.data);

        if (response.data.message === "Slot parkir berhasil dibatalkan") {
            setMessage("Sepeda berhasil dibuka.");
            setIsUnlocked(true); // Tandai sepeda tidak terkunci
            setStatus("Available"); // Perbarui status
            await fetchParkingSlotDetails(parkingSlot); // Refresh status slot
        } else {
            setMessage(response.data.message);
        }
        console.log("Respons dari server:", response.data);
    } catch (error) {
        console.error("Error saat membuka sepeda:", error.response?.data || error.message);
        setMessage("Terjadi kesalahan saat membuka sepeda. Coba lagi.");
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
            status === "Available"
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
        {status === "Available" ? (
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
          {status === "Available"
            ? "Your bike is unlocked!"
            : "Your Bike Is Locked"}
        </p>

        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default BikeInUse;
