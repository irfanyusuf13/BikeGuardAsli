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
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Tambahan state untuk animasi logout
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggingOut(true); // Tampilkan animasi loading
    setTimeout(() => {
      localStorage.removeItem("authToken");
      setIsLoggingOut(false); // Hentikan animasi
      navigate("/login");
    }, 2000); // Logout setelah 2 detik
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
      // Logic untuk kirim data ke backend dan buat QR code
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
    <div className="min-h-screen flex flex-col items-center bg-blue-100">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow-md border-b border-teal-500">
        <h2 className="text-2xl font-bold text-blue-800">BikeGuard</h2>
        <div className="flex items-center space-x-4">
          <span
            onClick={navigateToParkingStatus}
            className="text-gray-700 hover:text-teal-400 cursor-pointer"
          >
            Availability Parking
          </span>
          <span
            onClick={handleLogout}
            className="text-gray-700 hover:text-teal-400 cursor-pointer"
          >
            Log Out
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow bg-blue-100">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 mt-16">
          Welcome, Admin!
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <button
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => setShowCreateSlotModal(true)}
          >
            Create Parking Slot
          </button>
          <button
            className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition"
            onClick={() => setShowCreateQRModal(true)}
          >
            Create QR Code
          </button>
        </div>
      </div>

      {/* Animasi Logout */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-teal-400 font-medium">Logging Out...</p>
          </div>
        </div>
      )}

      {/* Create Slot Modal */}
      {showCreateSlotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-200 rounded-lg p-6 shadow-lg w-96">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Create Parking Slot
            </h3>
            <input
              type="text"
              placeholder="Enter slot name"
              value={slotName}
              onChange={(e) => setSlotName(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg bg-blue-100 text-gray-700 mb-4"
            />
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleCreateSlot}
              >
                {loading ? "Creating..." : "Create"}
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-200 rounded-lg p-6 shadow-lg w-96">
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
                className="w-full p-2 border border-gray-600 rounded-lg bg-blue-100 text-gray-700 mb-4"
              />
              <input
                type="datetime-local"
                placeholder="Enter Expiration Date"
                value={qrCodeData.expiration_date}
                onChange={(e) =>
                  setQrCodeData((prev) => ({
                    ...prev,
                    expiration_date: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-600 rounded-lg bg-blue-100 text-gray-700 mb-4"
              />
              <input
                type="text"
                placeholder="Enter Parking Slot"
                value={qrCodeData.associated_parking_slot}
                onChange={(e) =>
                  setQrCodeData((prev) => ({
                    ...prev,
                    associated_parking_slot: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-600 rounded-lg bg-blue-100 text-gray-700 mb-4"
              />
              <input
                type="text"
                placeholder="Enter User ID (Admin only)"
                value={qrCodeData.user_id}
                onChange={(e) =>
                  setQrCodeData((prev) => ({ ...prev, user_id: e.target.value }))
                }
                className="w-full p-2 border border-gray-600 rounded-lg bg-blue-100 text-gray-700 mb-4"
              />
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                  onClick={handleCreateQRCode}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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
