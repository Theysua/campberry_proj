import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isDemoMode, register, sendEmailVerificationCode } from '../services/api';
import { DEMO_TEST_ACCOUNT } from '../mocks/demoPrivateData';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, loginWithEmailCode, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const redirectTarget = useMemo(() => searchParams.get('redirect') || '/my-lists', [searchParams]);
  const authReason = useMemo(() => searchParams.get('reason') || '', [searchParams]);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [googleState, setGoogleState] = useState('idle');

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

    const ensureGoogleScript = () =>
      new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[data-google-gsi="true"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve(), { once: true });
          existingScript.addEventListener('error', () => reject(new Error('Failed to load Google sign-in.')), {
            once: true,
          });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client?hl=en';
        script.async = true;
        script.defer = true;
        script.dataset.googleGsi = 'true';
        script.addEventListener('load', () => resolve(), { once: true });
        script.addEventListener('error', () => reject(new Error('Failed to load Google sign-in.')), { once: true });
        document.body.appendChild(script);
      });

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
        locale: 'en',
      });
      setGoogleState('ready');
      return true;
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoogleState('loading');
    ensureGoogleScript()
      .then(() => {
        if (!cancelled && !initializeGoogleButton()) {
          throw new Error('Google sign-in is unavailable right now.');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setGoogleState('error');
          setError((current) => current || err.message || 'Google sign-in is unavailable right now.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [googleClientId, isLogin, loginWithGoogle, navigate, redirectTarget]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setIsSendingOtp(true);
    try {
      await sendEmailVerificationCode(email);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmailCode(email, otp);
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!otpSent) {
          await handleSendOtp(e);
          return;
        }
        await register(name, email, password, otp);
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
              <a style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }} onClick={() => { setIsLogin(!isLogin); setOtpSent(false); setError(''); }}>
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

            {authReason === 'preview_limit' && (
              <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--primary)', background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '14px', padding: '12px 14px' }}>
                You have reached the 10-activity guest preview limit. Sign in or create an account to continue researching and saving lists.
              </div>
            )}

            {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            {isLogin && googleClientId && !isDemoMode && authMethod === 'password' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 20px 0' }}>
                  <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
                  <span style={{ padding: '0 12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>CONTINUE WITH</span>
                  <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div ref={googleButtonRef} style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }} />
                  {googleState !== 'ready' && (
                    <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {googleState === 'error' ? 'Google sign-in is temporarily unavailable.' : 'Loading Google sign-in...'}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 24px 0' }}>
                  <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
                  <span style={{ padding: '0 12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>OR USE EMAIL</span>
                  <div style={{ flex: '1', height: '1px', background: 'var(--border)' }}></div>
                </div>
              </>
            )}

            <form onSubmit={authMethod === 'otp' ? (otpSent ? handleVerifyOtp : handleSendOtp) : handleSubmit}>
              {authMethod === 'password' && !isLogin && !otpSent && (
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="John Doe" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
              )}
              
              {(!otpSent || (authMethod === 'password' && isLogin)) && (
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Email address</label>
                  <input className="form-input" placeholder="you@example.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
              )}

              {authMethod === 'password' && (!otpSent || isLogin) && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" style={{ marginBottom: '0' }}>Password</label>
                    {isLogin && (
                      <button type="button" onClick={() => navigate('/reset-password')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input className="form-input" placeholder="Enter your password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
              )}

              {((authMethod === 'otp' && otpSent) || (!isLogin && otpSent)) && (
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Verification Code</label>
                  <input className="form-input" placeholder="6-digit code" type="text" value={otp} onChange={(event) => setOtp(event.target.value)} required />
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    Sent to {email}. <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontWeight: 600 }}>Change email</button>
                  </div>
                </div>
              )}

              <button type="submit" className="btn" disabled={isSendingOtp} style={{ width: '100%', padding: '16px', fontSize: '16px', justifyContent: 'center', marginBottom: '16px', opacity: isSendingOtp ? 0.7 : 1 }}>
                {authMethod === 'otp' 
                  ? (otpSent ? 'Login' : (isSendingOtp ? 'Sending...' : 'Send Magic Code')) 
                  : (isLogin ? 'Sign In' : (otpSent ? 'Complete Registration' : (isSendingOtp ? 'Sending...' : 'Send Verification Code')))}
              </button>

              {isLogin && (
                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={() => { setAuthMethod(authMethod === 'password' ? 'otp' : 'password'); setOtpSent(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    {authMethod === 'password' ? 'Use Email Code Instead' : 'Use Password Instead'}
                  </button>
                </div>
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
