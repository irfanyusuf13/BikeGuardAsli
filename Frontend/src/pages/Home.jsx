import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import axios from "axios";

const Home = () => {
  const [qrData, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("Guest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      const name = localStorage.getItem("userName");
      if (name) {
        setUsername(name);
      } else {
        setUsername("Guest");
      }
    };
    fetchUserData();
  }, []);

  const handleScan = (data) => {
    if (data && data !== qrData) {
      setQrData(data);
      verifyQRCode(data);
    }
  };

  const verifyQRCode = (scannedCode) => {
    setError(null);
    axios
      .post("http://localhost:3000/qr-code/verify", { code: scannedCode })
      .then((response) => {
        const { message, data } = response.data;

        if (message === "QR Code is valid" && data.associatedParkingSlot) {
          localStorage.setItem("parkingSlotId", data.associatedParkingSlot);
          navigate("/bike-in-use");
        } else {
          setError("QR Code valid tetapi tidak terkait dengan slot parkir.");
        }
      })
      .catch((error) => {
        console.error("Error during QR code verification:", error);
        setError("Gagal memverifikasi QR Code. Silakan coba lagi.");
      });
  };

  const handleError = (err) => {
    console.error(err);
    setError("Terjadi kesalahan saat memindai QR Code. Silakan coba lagi.");
  };

  const handleHistoryClick = () => {
    navigate("/history");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowLogoutModal(false);
      localStorage.removeItem("authToken");
      navigate("/login");
    }, 2000);
  };

  const navigateToParkingStatus = () => {
    navigate("/parking-status");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow-lg">
        <h2 className="text-3xl font-bold text-blue-600">BikeGuard</h2>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <img
              src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png"
              alt="User Icon"
              className="w-8 h-8"
            />
            <span className="text-blue-700 font-semibold">{username}</span>
          </div>
          <span
            onClick={handleHistoryClick}
            className="cursor-pointer text-gray-700 hover:text-blue-600"
          >
            History
          </span>
          <span
            onClick={navigateToParkingStatus}
            className="cursor-pointer text-gray-700 hover:text-blue-600"
          >
            Availability Parking
          </span>
          <span
            onClick={handleLogoutClick}
            className="cursor-pointer text-gray-700 hover:text-blue-600"
          >
            Log Out
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome, {username}!</h1>
        <p className="text-lg font-medium mb-6">
          Ready to park your bike securely? Let’s get started.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/384/384144.png"
          alt="Bike"
          className="w-64 mb-6 animate-pulse"
        />

        <button
          className="px-10 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
          onClick={() => setShowScanner(true)}
        >
          PARK NOW
        </button>

        {showScanner && (
          <div className="relative mt-8">
            <div
              className="rounded-lg shadow-lg bg-white p-4"
              style={{ width: "320px", height: "320px" }}
            >
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
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-blue-500 rounded-lg pointer-events-none"></div>
          </div>
        )}

        {error && <p className="mt-6 text-red-500 text-lg">{error}</p>}
        {qrData && (
          <p className="mt-6 text-green-500 text-lg">QR Code Detected: {qrData}</p>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
    <div className="bg-white rounded-lg p-6 shadow-xl transform scale-95 transition-transform duration-300">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">Logging out...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
              alt="Logout Icon"
              className="w-16 h-16 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You will need to log in again to continue using the app.
            </p>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105"
              onClick={confirmLogout}
            >
              Yes, Log Out
            </button>
            <button
              className="px-6 py-2 bg-gray-300 font-bold rounded-lg shadow-md hover:bg-gray-400 transition-transform transform hover:scale-105"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default Home;
