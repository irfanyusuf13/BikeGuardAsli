import React from "react";
import { Link } from "react-router-dom";

const BikeInLock = () => {
    return (
        <div className="min-h-screen bg-blue-100 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-md">
                <h2 className="text-2xl font-bold text-blue-600 ml-4">BikeGuard</h2>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <img src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png" alt="User Icon" className="w-6 h-6" />
                        <span>Username</span>
                    </div>
                    <Link to="/history" className="text-black">History</Link>
                    <Link to="/home" className="text-black">Home</Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow">
                <img src="https://img.icons8.com/ios-filled/100/000000/lock--v1.png" alt="Lock Icon" className="mb-4" />
                <p className="text-center font-semibold mb-2">Your bicycle is currently parked.</p>
                
                <button className="bg-gray-400 text-white py-2 px-6 rounded-full shadow-md mb-2">
                    UNLOCK
                </button>
                
                <p className="text-gray-600">Your Bike Is Locked</p>
            </div>
        </div>
    );
};

export default BikeInLock;
