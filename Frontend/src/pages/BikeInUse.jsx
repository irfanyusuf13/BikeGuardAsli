import React from "react";

const BikeInLock = () => {
    return (
        <div className="min-h-screen bg-gray-100">
          <div className="flex justify-between p-4 bg-white shadow-md">
            <h2 className="text-2xl font-bold">BIKEGUARD</h2>
            <button className="text-blue-500">Logout</button>
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <img src="https://img.icons8.com/ios-filled/100/000000/bicycle.png" alt="Bicycle" className="mb-4" />
              <button className="bg-gray-300 text-black py-2 px-8 rounded-full cursor-not-allowed">
                Sepeda Sedang Dipakai
              </button>
            </div>
          </div>
        </div>
      );
    };
export default BikeInLock;
