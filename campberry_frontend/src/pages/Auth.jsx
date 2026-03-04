import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';

export default function Auth() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/lists');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
        await login(email, password);
      }
      navigate('/lists');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <>
      <div className="page" id="page-auth">
        <div className="auth-container">
          <div className="auth-form">
            <div className="auth-form-inner">
              <h1>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
              <p className="subtitle">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </a>
              </p>

              {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div style={{ 'marginBottom': '20px' }}>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" placeholder="John Doe" type="text" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                )}
                <div style={{ 'marginBottom': '20px' }}>
                  <label className="form-label">Email address</label>
                  <input className="form-input" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div style={{ 'marginBottom': '28px' }}>
                  <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '6px' }}>
                    <label className="form-label" style={{ 'marginBottom': '0' }}>Password</label>
                    {isLogin && <span style={{ 'fontSize': '12px', 'color': 'var(--accent)', 'cursor': 'pointer', 'fontWeight': '600' }}>Forgot?</span>}
                  </div>
                  <input className="form-input" placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn" style={{ 'width': '100%', 'padding': '16px', 'fontSize': '16px', 'justifyContent': 'center' }}>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
              </form>
            </div>
          </div>
          <div className="auth-hero">
            <h2>Empower Your<br />Future</h2>
            <p>Join thousands of students and counselors discovering the best summer opportunities.</p>
          </div>
        </div>
      </div>
    </>
  );
}
