import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '450px', margin: '50px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <i className="fas fa-sign-in-alt" style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--primary-color)', display: 'block' }}></i>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Welcome Back!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue swapping</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><i className="fas fa-envelope"></i> Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label><i className="fas fa-lock"></i> Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '8px' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading"></span>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <i className="fas fa-arrow-right"></i>
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
          Create one here →
        </Link>
      </p>
    </div>
  );
}

export default Login;
