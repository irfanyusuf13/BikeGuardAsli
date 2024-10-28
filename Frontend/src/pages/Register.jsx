import React, { useState } from 'react';


const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-3xl font-bold text-center mb-4">Register Your Account</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600">
              Register
            </button>
          </div>
        </div>
      );
    };

export default Register;

