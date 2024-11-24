import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState(""); // State untuk admin-key
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setError(""); // Reset error jika pengguna mengganti role
    setAdminKey(""); // Reset admin-key jika pengguna mengganti role
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi jika role adalah admin dan admin-key kosong
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
        adminKey: role === "admin" ? adminKey : undefined, // Hanya kirim adminKey jika role adalah admin
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
    <section className="flex min-h-screen">
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

          {/* Input Tambahan untuk Admin Key */}
          {role === "admin" && (
            <div>
              <label
                htmlFor="adminKey"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Admin Key
              </label>
              <input
                type="text"
                name="adminKey"
                id="adminKey"
                placeholder="Enter admin key"
                className="w-full p-3 border rounded-lg text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>
          )}

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
