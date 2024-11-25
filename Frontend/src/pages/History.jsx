import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const History = () => {
  const [username, setUsername] = useState("User"); // Default username
  const parkingData = [
    { date: "12 October 2024", duration: "1 Hour 30 Minutes", time: "09:30–11:00" },
    { date: "11 October 2024", duration: "1 Hour 30 Minutes", time: "09:30–11:00" },
    { date: "10 October 2024", duration: "1 Hour 30 Minutes", time: "09:30–11:00" },
  ];

  // Ambil data pengguna dari localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-b border-blue-500">
        <h1 className="text-2xl font-bold text-blue-600">BikeGuard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-semibold">👤</span>
            </div>
            <span className="font-semibold">{username}</span>
          </div>
          <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
        </div>
      </header>

      {/* Recent Parking Section */}
      <section className="flex-grow px-8 py-6">
        <h2 className="text-3xl font-bold text-white mb-6">Recent Parking</h2>

        <div className="space-y-4">
          {parkingData.length === 0 ? (
            <p className="text-white text-center">No parking history available.</p>
          ) : (
            parkingData.map((parking, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
              >
                {/* Tanggal dan Durasi */}
                <div>
                  <p className="font-semibold text-gray-800">{parking.date}</p>
                  <p className="text-gray-500">{parking.duration}</p>
                </div>
                {/* Waktu Parkir */}
                <p className="font-semibold text-gray-800">{parking.time}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default History;
