import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-700 to-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Ultra</h1>
        <button
          onClick={() => navigate("/auth/login")} // ✅ Redirects to Login Page
          className="bg-white text-purple-700 px-6 py-3 rounded-lg shadow-lg hover:bg-purple-100 transition"
        >
          Start Messaging
        </button>
      </div>
    </div>
  );
};

export default StartPage;
