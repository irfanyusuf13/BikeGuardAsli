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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between p-4 bg-white shadow-md">
        <h2 className="text-2xl font-bold">BIKEGUARD</h2>
        <button className="text-blue-500">Logout</button>
      </div>
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-xl mb-4">Scan QR Code to lock Bike</h3>

        {/* Tombol untuk memunculkan scanner */}
        {!showScanner && (
          <button
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg"
            onClick={() => setShowScanner(true)}
          >
            Scan QR Code
          </button>
        )}

        {/* Scanner QR muncul jika tombol di klik */}
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
