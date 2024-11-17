import React, { useState } from 'react';

const Register = () => {
  const [role, setRole] = useState("user");

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <section className="flex min-h-screen">
      {/* Bagian Kiri dengan Warna Background #ADD8E6 */}
      <div className="hidden md:flex w-1/2 bg-[#ADD8E6] items-center justify-center">
      </div>

      {/* Bagian Kanan - Form Register */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 py-8 bg-white">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">BikeGuard</h2>
        <p className="text-gray-600 mb-8">Register Your Account</p>

        <form className="space-y-6 w-full max-w-sm">
          <div>
            <label className="block text-gray-700 font-semibold">EMAIL</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">USERNAME</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Dropdown Pilihan Role */}
          <div>
            <label className="block text-gray-700 font-semibold">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Register as {role === "admin" ? "Admin" : "User"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
