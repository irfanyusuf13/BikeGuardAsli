import React from 'react';

const History  = () => {
  const parkingData = [
    { date: '12 October 2024', duration: '1 Hours 30 Minutes', time: '09.30–11.00' },
    { date: '11 October 2024', duration: '1 Hours 30 Minutes', time: '09.30–11.00' },
    { date: '10 October 2024', duration: '1 Hours 30 Minutes', time: '09.30–11.00' },
  ];

  return (
    <div className="bg-blue-50 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span role="img" aria-label="user">👤</span>
          </div>
          <span className="font-semibold">Username</span>
        </div>
        <a href="#" className="font-semibold text-gray-700">Home</a>
      </div>

      {/* Recent Parking */}
      <div className="mt-8 px-4">
        <h2 className="text-2xl font-bold mb-4">RECENT PARKING</h2>
        <div className="space-y-4">
          {parkingData.map((parking, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{parking.date}</p>
                <p className="text-gray-500">{parking.duration}</p>
              </div>
              <p className="font-medium text-gray-800">{parking.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
