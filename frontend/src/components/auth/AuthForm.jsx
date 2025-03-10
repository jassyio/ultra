import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        {isLogin ? <Login /> : <Register />}
        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
