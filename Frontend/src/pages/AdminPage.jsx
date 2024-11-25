import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
  const [showCreateQRModal, setShowCreateQRModal] = useState(false);
  const [slotName, setSlotName] = useState("");
  const [qrCodeData, setQrCodeData] = useState({
    code: "",
    expiration_date: "",
    associated_parking_slot: "",
    user_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("authToken");
      setIsLoggingOut(false);
      navigate("/login");
    }, 2000);
  };

  const handleCreateSlot = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowCreateSlotModal(false);
      alert(`Slot ${slotName} berhasil dibuat!`);
      setSlotName("");
    }, 2000);
  };

  const handleCreateQRCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-qrcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qrCodeData),
      });

      const result = await response.json();
      if (response.ok) {
        setLoading(false);
        setShowCreateQRModal(false);
        alert(`QR Code dengan data "${qrCodeData.code}" berhasil dibuat!`);
        setQrCodeData({
          code: "",
          expiration_date: "",
          associated_parking_slot: "",
          user_id: "",
        });
      } else {
        setLoading(false);
        alert(result.message || "Gagal membuat QR Code");
      }
    } catch (error) {
      setLoading(false);
      alert("Gagal menghubungi server");
      console.error(error);
    }
  };

  const navigateToParkingStatus = () => {
    navigate("/admin-manage-parking");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-500 to-teal-500 text-white">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="text-3xl font-bold text-blue-600">BikeGuard Admin</h2>
        <div className="flex items-center space-x-6">
          <span
            onClick={navigateToParkingStatus}
            className="cursor-pointer text-gray-700 hover:text-teal-500 font-semibold"
          >
            Parking Status
          </span>
          <span
            onClick={handleLogout}
            className="cursor-pointer text-gray-700 hover:text-teal-500 font-semibold"
          >
            Log Out
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-5xl font-extrabold mb-6">Welcome, Admin!</h1>
        <p className="text-lg font-medium mb-10">
          Manage parking slots and QR codes with ease.
        </p>
        <div className="space-x-4">
          <button
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            onClick={() => setShowCreateSlotModal(true)}
          >
            Create Parking Slot
          </button>
          <button
            className="px-8 py-4 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105"
            onClick={() => setShowCreateQRModal(true)}
          >
            Create QR Code
          </button>
        </div>
      </div>

      {/* Logout Animation */}
      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-teal-400 font-semibold">Logging Out...</p>
          </div>
        </div>
      )}

      {/* Create Slot Modal */}
      {showCreateSlotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96 transform scale-95 transition-transform">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Create Parking Slot
            </h3>
            <input
              type="text"
              placeholder="Enter slot name"
              value={slotName}
              onChange={(e) => setSlotName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleCreateSlot}
              >
                {loading ? "Creating..." : "Create"}
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                onClick={() => setShowCreateSlotModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create QR Code Modal */}
      {showCreateQRModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96 transform scale-95 transition-transform">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Create QR Code
            </h3>
            <form>
              <input
                type="text"
                placeholder="Enter QR Code"
                value={qrCodeData.code}
                onChange={(e) =>
                  setQrCodeData((prev) => ({ ...prev, code: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <input
                type="datetime-local"
                value={qrCodeData.expiration_date}
                onChange={(e) =>
                  setQrCodeData((prev) => ({
                    ...prev,
                    expiration_date: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleCreateQRCode}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  onClick={() => setShowCreateQRModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
