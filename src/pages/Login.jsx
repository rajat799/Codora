import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/CSS/authStyle.css'; // Make sure to move this if it is in CSS/

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      let friendlyError = err.message.replace('Firebase: ', '').replace('Error ', '');
      if (err.code === 'auth/invalid-credential') friendlyError = 'Incorrect email or password.';
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Login to continue your coding journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <p style={{ color: 'red', minHeight: '20px' }}>{error}</p>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>

        <div className="social-auth">
          <p>or continue with</p>
          <div className="social-icons">
            <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
}
