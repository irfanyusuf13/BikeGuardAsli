import React, { useState } from "react";
import axios from "axios"; // Untuk melakukan permintaan ke API
import { useNavigate } from "react-router-dom"; // Untuk navigasi setelah login berhasil

const Login = () => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error sebelum mencoba login
  
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
        role,
      });
  
      const { data } = response.data;
  
      if (data && data.id) {
        // Simpan data pengguna ke localStorage
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userName", data.name); // Tambahkan ini
  
        // Navigasi ke halaman Home setelah login berhasil
        navigate("/home");
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed: Invalid email, password, or role.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen">
      {/* Bagian Kiri - Form Login */}
      <div className="w-1/2 flex flex-col justify-center px-12 py-8 bg-white">
        <a href="#" className="text-4xl font-bold text-blue-600 mb-8">
          BIKEGUARD
        </a>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Log In to Your Account
        </h1>

        <form className="space-y-6 w-full max-w-sm" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-3 border rounded-lg text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Dropdown Pilihan Role */}
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              className="w-full p-3 border rounded-lg text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-3"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : `Log In as ${role}`}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <p className="text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a href="register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>

      {/* Bagian Kanan - Gambar Sepeda dengan Warna Background #ADD8E6 */}
      <div className="w-1/2 flex items-center justify-center bg-[#ADD8E6] relative">
        <div className="absolute bottom-10 text-center">
          <h2 className="text-xl font-semibold text-blue-600">
            Manage your tasks with BikeGuard
          </h2>
          <p className="text-gray-500">
            Secure your bike and keep track of everything.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
