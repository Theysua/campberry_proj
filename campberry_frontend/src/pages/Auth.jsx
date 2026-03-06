import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isDemoMode, register } from '../services/api';
import { DEMO_TEST_ACCOUNT } from '../mocks/demoPrivateData';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const redirectTarget = useMemo(() => searchParams.get('redirect') || '/my-lists', [searchParams]);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  useEffect(() => {
    if (!isLogin || !googleClientId || !googleButtonRef.current || isDemoMode) {
      return;
    }

    let cancelled = false;
    let intervalId = null;

    const initializeGoogleButton = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) {
        return false;
      }

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            setError('');
            await loginWithGoogle(response.credential);
            navigate(redirectTarget, { replace: true });
          } catch (err) {
            setError(err.message || 'Google authentication failed');
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: 320,
        text: 'signin_with',
      });
      return true;
    };

    if (!initializeGoogleButton()) {
      intervalId = window.setInterval(() => {
        if (initializeGoogleButton() && intervalId) {
          window.clearInterval(intervalId);
        }
      }, 250);
    }

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [googleClientId, isLogin, loginWithGoogle, navigate, redirectTarget]);

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

      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  const fillDemoCredentials = () => {
    setIsLogin(true);
    setEmail(DEMO_TEST_ACCOUNT.email);
    setPassword(DEMO_TEST_ACCOUNT.password);
    setName(DEMO_TEST_ACCOUNT.name);
    setError('');
  };

  return (
    <div className="page" id="page-auth">
      <div className="auth-container">
        <div className="auth-form">
          <div className="auth-form-inner">
            <h1>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
            <p className="subtitle">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <a style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </a>
            </p>

            {isDemoMode && (
              <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '14px', padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>Demo mode is enabled on GitHub Pages.</div>
                <div style={{ marginBottom: '10px' }}>
                  You can test private features with the preset account below. Data is stored locally in your browser for demo purposes.
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.7, marginBottom: '10px' }}>
                  <div>Email: {DEMO_TEST_ACCOUNT.email}</div>
                  <div>Password: {DEMO_TEST_ACCOUNT.password}</div>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="btn-outline"
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                >
                  Use Demo Account
                </button>
              </div>
            )}

            {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="John Doe" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
              )}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Email address</label>
                <input className="form-input" placeholder="you@example.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: '0' }}>Password</label>
                </div>
                <input className="form-input" placeholder="Enter your password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', padding: '16px', fontSize: '16px', justifyContent: 'center', marginBottom: '16px' }}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
              {isLogin && googleClientId && !isDemoMode && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                    <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ padding: '0 12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>OR</span>
                    <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
                  </div>
                  <div ref={googleButtonRef} style={{ display: 'flex', justifyContent: 'center' }} />
                </>
              )}
            </form>
          </div>
        </div>
        <div className="auth-hero">
          <h2>Empower Your<br />Future</h2>
          <p>Join thousands of students and counselors discovering the best summer opportunities.</p>
        </div>
      </div>
    </div>
  );
}
