import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ParkingStatus = () => {
  const [parkingSlots, setParkingSlots] = useState([]); // State untuk menyimpan data slot parkir
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk mengambil data slot parkir dari API
  const fetchParkingSlots = async () => {
    try {
      const response = await fetch("http://localhost:3000/parking-slot/all");
      const data = await response.json();
      if (data && data.data) {
        setParkingSlots(data.data); // Menyimpan data slot parkir ke state
      }
    } catch (error) {
      console.error("Error fetching parking slots:", error);
    }
  };

  // Mengambil data slot parkir ketika komponen pertama kali dimuat
  useEffect(() => {
    fetchParkingSlots();
  }, []);

  // Fungsi untuk menangani parkir
  const handleParkNow = () => {
    navigate("/home"); // Arahkan ke halaman Home
  };

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-b border-blue-500">
        <h1 className="text-2xl font-bold text-blue-600">BikeGuard</h1>
        <nav className="flex space-x-8">
          <Link to="/history" className="text-gray-700 hover:text-blue-600 font-medium">
            History
          </Link>
          <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
        </nav>
      </header>

      {/* Parking Status Section */}
      <section className="flex-grow px-8 py-6">
        <h2 className="text-3xl font-bold text-white mb-6">Parking Status</h2>

        <div className="space-y-4">
          {parkingSlots.length === 0 ? (
            <p className="text-white text-center">Loading parking slots...</p>
          ) : (
            parkingSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
              >
                {/* Lokasi */}
                <span className="text-gray-800 font-semibold">
                  {slot.location}
                </span>
                <div className="flex items-center space-x-4">
                  {/* Status Slot */}
                  <span
                    className={
                      slot.status === "Available"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {slot.status}
                  </span>

                  {/* Tombol Park Now */}
                  {slot.status === "Available" && (
                    <button
                      onClick={handleParkNow}
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                      Park Now
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ParkingStatus;
