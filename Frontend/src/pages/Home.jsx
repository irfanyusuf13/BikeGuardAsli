import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

const Home = () => {
  const [qrData, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState(null); // State untuk menangkap error
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State untuk modal logout
  const [loading, setLoading] = useState(false); // State untuk animasi loading
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data && data !== qrData) {
      setQrData(data); // Set QR data jika data baru
      alert(`QR Code Scanned: ${data}`);
      navigate("/bike-in-use");
    }
  };

  const handleSimulatedScan = () => {
    const mockData = "Simulated QR Code Data"; // Data simulasi
    handleScan(mockData);
  };

  const handleError = (err) => {
    console.error(err);
    setError("An error occurred while scanning. Please try again.");
  };

  const handleHistoryClick = () => {
    navigate("/history");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Tampilkan modal konfirmasi
  };

  const confirmLogout = () => {
    setLoading(true); // Tampilkan loading spinner
    setTimeout(() => {
      setLoading(false);
      setShowLogoutModal(false);
      navigate("/login");
    }, 2000); // Simpan jeda selama 2 detik
  };

  const navigateToParkingStatus = () => {
    navigate("/parking-status"); // Navigasi ke halaman Parking Status
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow-md border-b border-purple-500">
        <h2 className="text-2xl font-bold text-blue-600">BikeGuard</h2>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Username</span>
          <span
            onClick={handleHistoryClick}
            className="text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            History
          </span>
          {/* Availability Parking Text */}
          <span
            onClick={navigateToParkingStatus}
            className="text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            Availability Parking
          </span>
          <span
            onClick={handleLogoutClick}
            className="text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            Log Out
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold mb-6">WELCOME</h1>
        <img
          src="https://media.istockphoto.com/id/544330072/id/vektor/ikon-sepeda.jpg?s=612x612&w=0&k=20&c=84oZKWHAZpv1nYlS8pFqLuXmrcEhSTuSd3Qu7aTlS8M="
          alt="Bike"
          className="w-48 mb-6"
        />

        {/* Buttons */}
        <div className="flex flex-col items-center space-y-4">
          <button
            className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition"
            onClick={() => setShowScanner(true)}
          >
            PARK NOW
          </button>

          <button
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={handleSimulatedScan}
          >
            Simulate QR Scan
          </button>
        </div>

        {/* QR Scanner */}
        {showScanner && (
          <div className="relative mt-4">
            <div
              className="overflow-hidden rounded-lg"
              style={{
                width: "300px", // Ukuran persegi
                height: "300px",
                position: "relative",
              }}
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

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        {/* QR Data Display */}
        {qrData && <p className="mt-4 text-green-600">QR Code Detected: {qrData}</p>}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
                <p className="mt-4 text-gray-600">Logging out...</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                <p className="mb-6">Are you sure you want to log out?</p>
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={confirmLogout}
                  >
                    Yes, Log Out
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
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
