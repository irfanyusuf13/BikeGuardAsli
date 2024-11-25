import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminManageParking = () => {
    const [parkingSlots, setParkingSlots] = useState([]);
    const [loading, setLoading] = useState(true); // Menambahkan state loading
    const [error, setError] = useState(null); // Menambahkan state error
    const navigate = useNavigate();

    const fetchParkingSlots = async () => {
        try {
            const response = await fetch('http://localhost:3000/parking-slot/all');
            const data = await response.json();
            if (data && data.data) {
                setParkingSlots(data.data);
                setLoading(false);
            }
        } catch (error) {
            setError('Error fetching parking slots');
            setLoading(false);
            console.error('Error fetching parking slots:', error);
        }
    };

    useEffect(() => {
        fetchParkingSlots();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-500 text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-black font-semibold">👤</span>
                    </div>
                    <span className="text-lg font-medium">Admin</span>
                </div>
                <nav className="flex space-x-8">
                    <Link to="/admin" className="text-gray-700 hover:text-teal-500 font-medium">
                        Home
                    </Link>
                </nav>
            </header>

            {/* Parking Status Section */}
            <section className="px-8 py-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Parking Status</h2>

                {loading ? (
                    <p className="text-gray-200 text-lg">Loading parking slots...</p>
                ) : error ? (
                    <p className="text-red-500 text-lg">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {parkingSlots.map((slot) => (
                            <div
                                key={slot.id}
                                className="flex items-center justify-between p-6 border border-gray-300 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold text-lg text-gray-800">{slot.location}</span>
                                    <span className="text-sm text-gray-500">{`ID: ${slot.id}`}</span>
                                </div>
                                <span
                                    className={`font-semibold ${slot.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {slot.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminManageParking;
