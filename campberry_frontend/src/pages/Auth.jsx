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
                <button type="submit" className="btn" style={{ 'width': '100%', 'padding': '16px', 'fontSize': '16px', 'justifyContent': 'center', 'marginBottom': '16px' }}>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
                <div style={{ 'display': 'flex', 'alignItems': 'center', 'margin': '24px 0' }}>
                  <div style={{ 'flex': '1', 'height': '1px', 'background': 'var(--border)' }}></div>
                  <span style={{ 'padding': '0 12px', 'fontSize': '13px', 'color': 'var(--text-secondary)', 'fontWeight': '600' }}>OR</span>
                  <div style={{ 'flex': '1', 'height': '1px', 'background': 'var(--border)' }}></div>
                </div>
                <button type="button" onClick={() => alert('Google authentication coming soon!')} className="btn-outline" style={{ 'width': '100%', 'padding': '16px', 'fontSize': '16px', 'justifyContent': 'center', 'display': 'flex', 'gap': '12px', 'alignItems': 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
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
