import { useState } from "react";

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="bg-white p-6 rounded-lg shadow-lg w-80"
    >
      <h2 className="text-2xl font-bold text-center mb-4">
        {type === "register" ? "Sign Up" : "Login"}
      </h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />
      <button
        type="submit"
        className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-600 transition"
      >
        {type === "register" ? "Sign Up" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
