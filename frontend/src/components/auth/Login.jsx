import React, { useContext, useState } from 'react';
import AuthForm from './AuthForm';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setError('');
    try {
      await login(username, password, rememberMe);
      navigate('/chat');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      {/* Geometric Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.03) 75%, rgba(255, 255, 255, 0.03))',
          backgroundSize: '20px 20px',
          zIndex: 1,
        }}
      />

      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <p
            style={{
              color: '#ff4444',
              marginBottom: '1rem',
              fontWeight: '500',
            }}
          >
            {error}
          </p>
        )}

        <AuthForm isLogin={true} onSubmit={handleLogin} isLoading={isLoading} />

        {/* Remember Me Checkbox */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ marginRight: '0.5rem', cursor: 'pointer' }}
          />
          <label htmlFor="rememberMe" style={{ color: '#fff', cursor: 'pointer' }}>
            Remember Me
          </label>
        </div>

        {/* Create Account Link */}
        <p style={{ color: '#fff', marginTop: '1rem' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#ff00ff',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;