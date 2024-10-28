import React from "react";

const Login = () => {
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
                <form className="space-y-6 w-full max-w-sm">
                    <div>
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter your username"
                            className="w-full p-3 border rounded-lg text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-3"
                    >
                        Log In
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                        Don’t have an account?{" "}
                        <a href="register" className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                </form>
            </div>

            {/* Bagian Kanan - Gambar Sepeda */}
            <div className="w-1/2 bg-blue-100 flex items-center justify-center relative">
                <img
                    src="https://www.shutterstock.com/image-vector/colorful-cartoon-bicycle-simple-design-260nw-1724445172.jpg"
                    alt="Bicycle"
                    className="w-3/4 h-auto"
                />
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
