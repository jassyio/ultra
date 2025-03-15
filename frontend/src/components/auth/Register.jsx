import React, { useContext } from 'react';
import AuthForm from './AuthForm';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (username, password) => {
    await register(username, password);
    navigate('/setup'); // Navigate to setup after registration
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(160deg, #1a0033, #2a004f, #4b0082, #7a00a3, #9c27b0)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.05) 75%)',
          backgroundSize: '20px 20px',
          zIndex: 1,
        }}
      />

      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
          zIndex: 2,
          width: '400px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(90deg, #ff00ff, #ff1493, #ff4500)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Register
        </h2>
        <AuthForm isLogin={false} onSubmit={handleRegister} />

        {/* Login Link */}
        <p style={{ color: '#fff', marginTop: '1rem' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#ff00ff',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
