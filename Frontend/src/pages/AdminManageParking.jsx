import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminManageParking = () => {
    const [parkingSlots, setParkingSlots] = useState([]); // State untuk menyimpan data slot parkir
    const navigate = useNavigate(); // Hook untuk navigasi

    // Fungsi untuk mengambil data slot parkir dari API
    const fetchParkingSlots = async () => {
        try {
            const response = await fetch('http://localhost:3000/parking-slot/all');
            const data = await response.json();
            if (data && data.data) {
                setParkingSlots(data.data); // Menyimpan data slot parkir ke state
            }
        } catch (error) {
            console.error('Error fetching parking slots:', error);
        }
    };

    // Mengambil data slot parkir ketika komponen pertama kali dimuat
    useEffect(() => {
        fetchParkingSlots();
    }, []);

    return (
        <div className="min-h-screen bg-blue-100">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-black font-semibold">👤</span>
                    </div>
                    <span className="text-lg font-medium">Username</span>
                </div>
                <nav className="flex space-x-8">
                    <Link to="/admin" className="text-gray-700 hover:text-black font-medium">
                        Home
                    </Link>
                </nav>
            </header>

            {/* Parking Status Section */}
            <section className="px-8 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Parking Status</h2>

                <div className="space-y-4">
                    {parkingSlots.length === 0 ? (
                        <p>Loading parking slots...</p>
                    ) : (
                        parkingSlots.map((slot) => (
                            <div key={slot.id} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
                                <span className="font-medium text-gray-800">{slot.location}</span>
                                <span className={slot.status === 'Available' ? 'text-green-600' : 'text-red-600'}>
                                    {slot.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminManageParking;
