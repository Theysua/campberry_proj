import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Scroll-triggered Reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });

    // 2. Card Mouse Tracking
    const handleGlobalMouseMove = (e) => {
      document.querySelectorAll('.card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    };
    document.addEventListener('mousemove', handleGlobalMouseMove);

    // 3. Hero Parallax
    const hero = document.getElementById('hero-section');
    const handleHeroMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const orbs = hero.querySelectorAll('.hero-orb');
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 12;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };
    if (hero) hero.addEventListener('mousemove', handleHeroMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      if (hero) hero.removeEventListener('mousemove', handleHeroMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="page active" id="page-home">
        {/* Hero (Light, airy, colorful orbs) */}
        <div className="hero" id="hero-section">
          {/* Colorful diffused orbs */}
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-orb hero-orb-4"></div>
          <h1 className="animate-in"><span className="gradient-text">Find Your Dream Program</span></h1>
          <p className="animate-in delay-1">Discover extracurriculars that matter.<br />Curated, ranked, and reviewed by
            experts.</p>
          <div className="hero-search animate-in delay-2">
            <input placeholder="Search over 1,000 opportunities..." type="text" />
            <button onClick={() => navigate('/search')}>Search</button>
          </div>
          {/* Stats bar */}
          <div className="stats-bar animate-in delay-3">
            <div className="stat-item">
              <div className="stat-number">1,000+</div>
              <div className="stat-label">Programs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Competitions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Reviewers</div>
            </div>
          </div>
          <div className="top-searches animate-in delay-4">
            <span className="top-search-pill" onClick={() => navigate('/search')}>☀️ Summer</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>🔬 STEM</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>💼 Business</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>💻 Coding</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>✍️ Writing</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>🎨 Arts</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>🔍 Research</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>⚽ Sports</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>🎵 Music</span>
            <span className="top-search-pill" onClick={() => navigate('/search')}>🌎 Hong Kong</span>
          </div>
        </div>
        {/* Trusted By (Logo Wall) */}
        <div className="logo-wall reveal">
          <span className="logo-wall-item">Stanford</span>
          <span className="logo-wall-item">MIT</span>
          <span className="logo-wall-item">Harvard</span>
          <span className="logo-wall-item">Yale</span>
          <span className="logo-wall-item">Princeton</span>
          <span className="logo-wall-item">Columbia</span>
          <span className="logo-wall-item">UPenn</span>
        </div>
        {/* Hot Programs */}
        <div style={{ 'maxWidth': '1200px', 'margin': '48px auto', 'padding': '0 24px' }}>
          <div className="reveal" style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': '24px' }}>
            <div className="section-title">🔥 Hot Programs</div>
            <span onClick={() => navigate('/lists')} style={{ 'fontSize': '14px', 'color': 'var(--accent)', 'fontWeight': '600', 'cursor': 'pointer', 'transition': 'letter-spacing 0.3s' }}>See All Lists →</span>
          </div>
          <div className="hot-row">
            <div className="hot-card reveal-scale" onClick={() => navigate('/lists')} style={{ 'borderTop': 'none' }}>
              <div style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': '4px', 'background': 'var(--accent-gradient)', 'borderRadius': 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              </div>
              <h4>Counselors' Top Picks</h4>
              <div className="meta">By School Counseling Group</div>
            </div>
            <div className="hot-card reveal-scale" onClick={() => navigate('/lists')} style={{ 'borderTop': 'none', 'transitionDelay': '0.1s' }}>
              <div style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': '4px', 'background': 'linear-gradient(135deg, var(--orange) 0%, var(--yellow) 100%)', 'borderRadius': 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              </div>
              <h4>Pre-college Summer Programs</h4>
              <div className="meta">By Campberry</div>
            </div>
            <div className="hot-card reveal-scale" style={{ 'borderTop': 'none', 'transitionDelay': '0.2s' }}>
              <div style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': '4px', 'background': 'linear-gradient(135deg, var(--mint-dark) 0%, var(--mint) 100%)', 'borderRadius': 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              </div>
              <h4>Best Free Programs</h4>
              <div className="meta">By Campberry</div>
            </div>
            <div className="hot-card reveal-scale" onClick={() => navigate('/lists')} style={{ 'borderTop': 'none', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'transitionDelay': '0.3s' }}>
              <div style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': '4px', 'background': 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)', 'borderRadius': 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              </div>
              <span style={{ 'fontSize': '15px', 'fontWeight': '700', 'color': 'var(--accent)' }}>Explore More →</span>
            </div>
          </div>
        </div>
        {/* Campberry Ratings */}
        <div style={{ 'maxWidth': '1200px', 'margin': '48px auto', 'padding': '0 24px' }}>
          <div className="reveal" style={{ 'marginBottom': '24px' }}>
            <div className="section-title">Campberry Ratings
              <span style={{ 'background': 'var(--yellow)', 'color': 'var(--text)', 'fontSize': '11px', 'padding': '4px 12px', 'borderRadius': 'var(--radius-pill)', 'fontWeight': '700', 'letterSpacing': '0.03em' }}>NEW</span>
            </div>
            <div className="section-subtitle">Find the best opportunities — ranked for quality and cost by our
              expert community.</div>
          </div>
          <div className="rating-grid">
            <div className="rating-card accent-top reveal-scale">
              <h4>Experts' Choice</h4>
              <div className="desc">Top-tier programs selected by consultants.</div>
              <div style={{ 'display': 'flex', 'gap': '8px', 'marginBottom': '20px', 'flexWrap': 'wrap' }}>
                <span className="badge-most">MOST RECOMMENDED</span>
                <span className="badge-highly">HIGHLY RECOMMENDED</span>
              </div>
              <div className="link">Explore Experts' Choice →</div>
            </div>
            <div className="rating-card primary-top reveal-scale" style={{ 'transitionDelay': '0.1s' }}>
              <h4>Impact on Admissions</h4>
              <div className="desc">Proven effectiveness in elite college review.</div>
              <div style={{ 'display': 'flex', 'gap': '8px', 'marginBottom': '20px', 'flexWrap': 'wrap' }}>
                <span className="badge-impact">High Impact</span>
              </div>
              <div className="link">See High-Impact Programs →</div>
            </div>
          </div>
        </div>
        {/* Why Campberry */}
        <div style={{ 'maxWidth': '1200px', 'margin': '48px auto 16px auto', 'padding': '0 24px' }}>
          <div className="section-title reveal" style={{ 'marginBottom': '24px' }}>Why Campberry?</div>
          <div className="feature-grid">
            <div className="feature-card reveal-scale" style={{ 'background': 'var(--mint)', 'borderColor': 'var(--mint-dark)' }}>
              <div className="icon">🔒</div>
              <div className="label" style={{ 'color': 'var(--primary)' }}>100% Data Privacy</div>
            </div>
            <div className="feature-card reveal-scale" style={{ 'background': 'var(--mint)', 'borderColor': 'var(--mint-dark)', 'transitionDelay': '0.1s' }}>
              <div className="icon">⚖️</div>
              <div className="label" style={{ 'color': 'var(--primary)' }}>Unbiased Algorithms</div>
            </div>
            <div className="feature-card reveal-scale" style={{ 'background': '#fffde6', 'borderColor': '#fae09c', 'transitionDelay': '0.2s' }}>
              <div className="icon">⭐</div>
              <div className="label" style={{ 'color': '#92400e' }}>Reviews &amp; Rankings</div>
              <div style={{ 'fontSize': '11px', 'color': '#92400e', 'marginTop': '5px' }}>by experts and parents</div>
            </div>
          </div>
          <div className="cta-grid">
            <div className="cta-block reveal-scale" style={{ 'background': 'linear-gradient(135deg, var(--navy) 0%, #0a2f5c 100%)' }}>
              <h3>Search 1,000+ Opportunities</h3>
              <p>✓ New: 200+ competitions</p>
            </div>
            <div className="cta-block reveal-scale" style={{ 'background': 'linear-gradient(135deg, var(--orange) 0%, var(--yellow) 100%)', 'transitionDelay': '0.1s' }}>
              <h3 style={{ 'color': 'var(--navy)' }}>Save Time and Don't Miss Out</h3>
              <p style={{ 'color': 'var(--navy)' }}>✓ Search powered by AI</p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ 'maxWidth': '1200px', 'margin': '64px auto 0', 'padding': '40px 24px', 'borderTop': '1px solid var(--border)', 'textAlign': 'center' }}>
          <div style={{ 'fontSize': '13px', 'color': 'var(--text-secondary)' }}>© 2026 Campberry. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
