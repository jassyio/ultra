import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-indigo-600 text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center px-6"
      >
        <h1 className="text-5xl font-bold mb-4">Ultra Messenger</h1>
        <p className="text-lg mb-6">Stay connected, chat instantly, and experience seamless messaging.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-200 transition"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default StartPage;
