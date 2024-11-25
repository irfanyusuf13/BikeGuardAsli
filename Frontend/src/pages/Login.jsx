import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setError("");
    setAdminKey("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (role === "admin" && adminKey !== "onlygroup6") {
      setError("Invalid admin key.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
        role,
        adminKey: role === "admin" ? adminKey : undefined,
      });

      const { data } = response.data;

      if (data && data.id) {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userName", data.name);

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
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
    <section className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center md:w-1/2 px-8 py-12 bg-white shadow-lg">
        <div className="mb-6 text-center">
          <a href="#" className="text-4xl font-extrabold text-blue-600">
            BIKEGUARD
          </a>
          <p className="mt-2 text-gray-500">Secure your bike with ease.</p>
        </div>

        <form className="w-full max-w-sm space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {role === "admin" && (
            <div>
              <label
                htmlFor="adminKey"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Key
              </label>
              <input
                type="password"
                name="adminKey"
                id="adminKey"
                placeholder="Enter admin key"
                className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : `Log In as ${role}`}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <p className="text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a
              href="register"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Register
            </a>
          </p>
        </form>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-blue-500 to-blue-700 text-white items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to BikeGuard</h2>
          <p className="mt-2 text-lg">
            Manage your bike security and tasks efficiently.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
