import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

const Home = () => {
  const [qrData, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false); 
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      setQrData(data);
      alert(`QR Code Scanned: ${data}`);
      navigate("/bike-in-use");
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  // Handler untuk tombol History
  const handleHistoryClick = () => {
    navigate("/history");
  };

  // Handler untuk tombol Log Out
  const handleLogoutClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow-md border-b border-purple-500">
        <h2 className="text-2xl font-bold text-blue-600">BikeGuard</h2>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Username</span>
          <button onClick={handleHistoryClick} className="text-gray-600">History</button>
          <button onClick={handleLogoutClick} className="text-gray-600">Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold mb-6">WELCOME</h1>
        <img src="path-to-your-bike-image.png" alt="Bike" className="w-48 mb-6" /> {/* Replace with actual image path */}
        
        {/* Park Button */}
        <button
          className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition"
          onClick={() => setShowScanner(true)}
        >
          PARK NOW
        </button>

        {/* QR Scanner */}
        {showScanner && (
          <div className="w-72 h-72 mt-4">
            <QrReader
              scanDelay={300}
              onResult={(result, error) => {
                if (result) {
                  handleScan(result?.text);
                }
                if (error) {
                  handleError(error);
                }
              }}
              constraints={{ facingMode: "environment" }}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {qrData && (
          <p className="mt-4 text-green-600">
            QR Code Detected: {qrData}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
