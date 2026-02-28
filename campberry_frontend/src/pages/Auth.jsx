import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/lists');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate('/lists');
  };

  return (
    <>
      <div className="page" id="page-auth">
        <div className="auth-container">
          <div className="auth-form">
            <div className="auth-form-inner">
              <h1>Welcome back</h1>
              <p className="subtitle">Don't have an account? <a>Sign Up</a></p>
              <button className="auth-google-btn" onClick={handleLogin}>
                <svg height="18" viewbox="0 0 24 24" width="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Continue with Google
              </button>
              <div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '16px', 'marginBottom': '24px' }}>
                <div style={{ 'flex': '1', 'height': '1px', 'background': 'var(--border)' }}></div>
                <span style={{ 'fontSize': '13px', 'color': 'var(--text-secondary)', 'fontWeight': '500' }}>or</span>
                <div style={{ 'flex': '1', 'height': '1px', 'background': 'var(--border)' }}></div>
              </div>
              <div style={{ 'marginBottom': '20px' }}>
                <label className="form-label">Email address</label>
                <input className="form-input" placeholder="you@example.com" type="email" />
              </div>
              <div style={{ 'marginBottom': '28px' }}>
                <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '6px' }}>
                  <label className="form-label" style={{ 'marginBottom': '0' }}>Password</label>
                  <span style={{ 'fontSize': '12px', 'color': 'var(--accent)', 'cursor': 'pointer', 'fontWeight': '600' }}>Forgot?</span>
                </div>
                <input className="form-input" placeholder="••••••••" type="password" />
              </div>
              <button className="btn" onClick={handleLogin} style={{ 'width': '100%', 'padding': '16px', 'fontSize': '16px', 'justifyContent': 'center' }}>Sign In</button>
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
