import React from "react";
import { Link } from "react-router-dom";

const ParkingStatus = () => {
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
                    <Link to="/history" className="text-gray-700 hover:text-black font-medium">
                        History
                    </Link>
                    <Link to="/home" className="text-gray-700 hover:text-black font-medium">
                        Home
                    </Link>
                </nav>
            </header>

            {/* Parking Status Section */}
            <section className="px-8 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Parking Status</h2>
                
                <div className="space-y-4">
                    {/* Parking 1 - Available */}
                    <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
                        <span className="font-medium text-gray-800">Parking 1</span>
                        <div className="flex items-center space-x-4">
                            <span className="text-green-600 font-medium">Available</span>
                            <button className="text-blue-600 font-semibold hover:underline">Park Now</button>
                        </div>
                    </div>

                    {/* Parking 2 - Unavailable */}
                    <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
                        <span className="font-medium text-gray-800">Parking 2</span>
                        <span className="text-red-600 font-medium">Unavailable</span>
                    </div>

                    {/* Parking 3 - Unavailable */}
                    <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
                        <span className="font-medium text-gray-800">Parking 3</span>
                        <span className="text-red-600 font-medium">Unavailable</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ParkingStatus;
