import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role: user
  const [adminKey, setAdminKey] = useState(""); // Admin Key Input
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  const navigate = useNavigate(); // Untuk navigasi setelah registrasi berhasil

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    if (event.target.value !== "admin") {
      setAdminKey(""); // Reset admin key jika bukan admin
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading menjadi true

    if (role === "admin" && adminKey !== "onlygroup6") {
      setError("Invalid admin key.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          role, // Role dikirim langsung dari state
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || "Registration successful!");
        setError("");

        // Setelah registrasi berhasil, pindah ke halaman login
        setTimeout(() => {
          navigate("/login"); // Mengarahkan ke halaman login
        }, 1000); // Delay sedikit agar pengguna melihat pesan sukses
      } else {
        setError(data.message || "An error occurred during registration.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred. Please try again later.");
      setSuccess("");
    } finally {
      setIsLoading(false); // Set loading menjadi false
    }
  };

  return (
    <section className="flex min-h-screen">
      {/* Bagian Kiri dengan Warna Background #ADD8E6 */}
      <div className="hidden md:flex w-1/2 bg-[#ADD8E6] items-center justify-center"></div>

      {/* Bagian Kanan - Form Register */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 py-8 bg-white">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">BikeGuard</h2>
        <p className="text-gray-600 mb-8">Register Your Account</p>

        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
          <div>
            <label className="block text-gray-700 font-semibold">EMAIL</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">USERNAME</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
              required
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
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Input Admin Key (Hanya Muncul jika Admin) */}
          {role === "admin" && (
            <div>
              <label className="block text-gray-700 font-semibold">Admin Key</label>
              <input
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Pesan Error atau Sukses */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
