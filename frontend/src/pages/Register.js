import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name, gender || undefined, dateOfBirth || undefined, phone || undefined);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <i className="fas fa-user-plus" style={{ fontSize: '36px', marginBottom: '16px', color: 'var(--primary-color)', display: 'block' }}></i>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Join SwapIt</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Start swapping items today!</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><i className="fas fa-user"></i> Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
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
            placeholder="At least 8 characters"
            required
            minLength={8}
          />
        </div>
        <div className="form-group">
          <label><i className="fas fa-phone"></i> Phone (Optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
          />
        </div>
        <div className="form-group">
          <label>Gender (Optional)</label>
          <div className="radio-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
            {['Male', 'Female', 'Other'].map((g) => (
              <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Date of Birth (Optional)</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <i className="fas fa-check"></i>
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
          Sign in here →
        </Link>
      </p>
    </div>
  );
}

export default Register;
