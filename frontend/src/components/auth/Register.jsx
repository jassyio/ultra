// src/components/auth/Register.jsx
import React, { useContext } from 'react';
import AuthForm from './AuthForm';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = (username, password) => {
    register(username, password);
    navigate('/chat');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <AuthForm isLogin={false} onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default Register;