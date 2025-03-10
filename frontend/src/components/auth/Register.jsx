import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Mock registration (No backend)
    if (name && email && password) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/setup"); // Move to setup page
    }
  };

  return (
    <div className="flex items-center justify-center h-screen 
      bg-gradient-to-r from-purple-700 to-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button type="submit"
            className="w-full bg-purple-600 hover:bg-purple-800 transition p-3 rounded-lg font-semibold">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?  
          <span className="text-purple-400 cursor-pointer" onClick={() => navigate("/login")}> Log In</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
