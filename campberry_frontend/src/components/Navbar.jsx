import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { warmSearchBootstrapCache } from '../services/api';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();
  const handleWarmFind = () => {
    warmSearchBootstrapCache().catch(() => {
      // Ignore prefetch failures; the actual navigation will still fetch live data.
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const scrollY = window.scrollY;
      if (scrollY > 80) {
        headerRef.current.style.padding = '10px 40px';
        headerRef.current.style.boxShadow = 'var(--shadow-md)';
      } else {
        headerRef.current.style.padding = '16px 40px';
        headerRef.current.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header id="main-header" ref={headerRef}>
        <div
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', transition: 'transform 0.3s var(--ease-spring)' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src={logo} alt="Campberry Logo" style={{ height: '32px' }} />
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/search')} onMouseEnter={handleWarmFind} onFocus={handleWarmFind}>Find</button>
          <button onClick={() => navigate('/lists')}>Lists</button>
          <button onClick={() => navigate('/my-lists')}>My Lists</button>
          {isAuthenticated ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
              <button onClick={() => navigate('/saved-programs')}>Saved</button>
              <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--primary)', cursor: 'default' }}>
                <span style={{ background: 'var(--mint)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', color: 'var(--primary)', marginRight: '6px', fontSize: '12px' }}>
                  {user?.name.charAt(0)}
                </span>
                <span className="desktop-only">{user?.name}</span>
              </div>
              <button className="btn-outline" onClick={logout} style={{ padding: '6px 12px', fontSize: '13px', marginLeft: '0' }}>Sign Out</button>
            </div>
          ) : (
            <button className="btn-outline" onClick={() => navigate('/auth')} style={{ marginLeft: '8px' }}>Sign In</button>
          )}
        </div>
      </header>
    </>
  );
}
