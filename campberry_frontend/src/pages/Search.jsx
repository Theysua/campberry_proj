import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { ChevronDown, Check } from 'lucide-react';
import { getPrograms } from '../services/api';

export default function Search() {
  const navigate = useNavigate();
  useScrollReveal();

  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Relevancy');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const sortRef = useRef(null);

  useEffect(() => {
    getPrograms().then(res => {
      setPrograms(res.data);
      if (res.meta) setTotalPrograms(res.meta.total);
    }).catch(err => console.error("Failed to load programs", err));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  useScrollReveal();
  return (
    <>
      <div className="page" id="page-search">
        <div style={{ 'maxWidth': '1200px', 'margin': '0 auto', 'padding': '20px 24px 40px 24px' }}>
          <button className="btn-outline" onClick={() => navigate('/home')} style={{ 'marginBottom': '20px', 'fontSize': '13px', 'padding': '6px 18px' }}>← Back</button>
          <div className="hero-search" style={{ 'margin': '0 0 30px 0', 'maxWidth': '100%' }}>
            <input placeholder="Search over 1,000 opportunities..." style={{ 'padding': '18px 24px', 'color': 'var(--text)' }} type="text" />
            <button onClick={() => navigate('/search')} style={{ 'padding': '0 40px' }}>Search</button>
          </div>
          <div style={{ 'display': 'flex', 'gap': '30px', 'alignItems': 'flex-start' }}>
            {/* Left Sidebar Filters - Hidden on mobile unless open */}
            <div className={`filter-panel ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
              <div className="filter-panel-header">
                <strong style={{ 'fontSize': '20px', 'color': 'var(--primary)', 'letterSpacing': '-0.02em' }}>Filters</strong>
                <div style={{ 'display': 'flex', 'gap': '16px', 'alignItems': 'center' }}>
                  <span style={{ 'fontSize': '13px', 'color': 'var(--accent)', 'cursor': 'pointer', 'fontWeight': '600' }}>Reset Filters</span>
                  <button className="mobile-close-filter" onClick={() => setIsMobileFilterOpen(false)}>×</button>
                </div>
              </div>
              {/* Quick Filters */}
              <details className="filter-accordion" open>
                <summary className="accordion-header" style={{ 'borderTop': 'none', 'marginTop': '0', 'paddingTop': '0' }}>
                  Quick filters <span className="chevron">▼</span>
                </summary>
                {/* Experts Choice */}
                <div style={{ 'marginTop': '15px' }}>
                  <div className="filter-section-title">Expert's Review</div>
                  <div className="segmented-control">
                    <button className="segmented-btn" style={{ flexDirection: 'column' }}>
                      Most<br />Recommended
                    </button>
                    <button className="segmented-btn" style={{ flexDirection: 'column' }}>
                      High<br />Impact
                    </button>
                  </div>
                </div>
                {/* Type */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Type</div>
                  <div className="segmented-control">
                    <button className="segmented-btn">
                      <span style={{ 'fontSize': '16px' }}>🎓</span>
                      Program
                    </button>
                    <button className="segmented-btn">
                      <span style={{ 'fontSize': '16px' }}>🏆</span>
                      Competition
                    </button>
                  </div>
                </div>
                {/* Location */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Location</div>
                  <div style={{ 'position': 'relative' }}>
                    <span style={{ 'position': 'absolute', 'left': '12px', 'top': '11px', 'color': 'var(--text-secondary)' }}>📍</span>
                    <input className="filter-input" placeholder="Enter a city, state, or zip..." style={{ 'paddingLeft': '36px' }} type="text" />
                  </div>
                  <div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'marginTop': '10px' }}>
                    <span style={{ 'fontSize': '14px', 'color': 'var(--text-secondary)' }}>Radius</span>
                    <select className="filter-input" style={{ 'width': '80px', 'padding': '6px 10px', 'background': 'var(--border-light)', 'border': 'none', 'borderRadius': 'var(--radius-sm)' }}>
                      <option>5 mi</option>
                      <option>10 mi</option>
                      <option>25 mi</option>
                      <option>50 mi</option>
                      <option>100 mi</option>
                    </select>
                  </div>
                  <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginTop': '15px', 'fontSize': '14px', 'color': 'var(--text-secondary)' }}>
                    <label style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'cursor': 'pointer' }}>
                      Include Online <input checked="" style={{ 'width': '16px', 'height': '16px', 'accentColor': 'var(--accent)' }} type="checkbox" />
                    </label>
                    <label style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'cursor': 'pointer' }}>
                      Online Only <input style={{ 'width': '16px', 'height': '16px', 'accentColor': 'var(--accent)' }} type="checkbox" />
                    </label>
                  </div>
                </div>
                {/* Season */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Season</div>
                  <div className="segmented-control">
                    <button className="segmented-btn">☀️<br />Summer</button>
                    <button className="segmented-btn">🍂<br />Fall</button>
                    <button className="segmented-btn">🌱<br />Spring</button>
                  </div>
                </div>
                {/* Grade */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Current grade <span style={{ 'color': 'var(--accent)', 'cursor': 'pointer', 'fontWeight': 'normal' }}>?</span></div>
                  <div className="segmented-control" style={{ flexWrap: 'wrap' }}>
                    <button className="segmented-btn" style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)' }}>6</button>
                    <button className="segmented-btn" style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)' }}>7</button>
                    <button className="segmented-btn" style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)' }}>8</button>
                    <button className="segmented-btn" style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)' }}>9</button>
                    <button className="segmented-btn" style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)' }}>10</button>
                    <button className="segmented-btn" style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)' }}>11</button>
                    <button className="segmented-btn" style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)' }}>12</button>
                  </div>
                </div>
                {/* Interests */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Interests</div>
                  <div style={{ 'position': 'relative' }}>
                    <span style={{ 'position': 'absolute', 'left': '12px', 'top': '11px', 'color': 'var(--text-secondary)' }}>🔍</span>
                    <input className="filter-input" placeholder="Add more interests to filter..." style={{ 'paddingLeft': '36px' }} type="text" />
                  </div>
                </div>
                {/* Advanced Criteria */}
                <div style={{ 'marginTop': '15px', 'paddingTop': '15px', 'borderTop': '1px solid var(--border)' }}>
                  <label className="checkbox-row"><input type="checkbox" /> Highly Selective</label>
                  <label className="checkbox-row"><input type="checkbox" /> Allows International Students</label>
                  <label className="checkbox-row"><input type="checkbox" /> Offers College Credit</label>
                  <label className="checkbox-row"><input type="checkbox" /> 1-on-1 programs</label>
                </div>
              </details>
            </div>
            {/* Right Results Section */}
            <div style={{ 'flex': '1' }}>
              <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': '24px', 'flexWrap': 'wrap', 'gap': '12px' }}>
                <h2 style={{ 'margin': '0', 'fontSize': '24px', 'fontWeight': '800', 'color': 'var(--primary)', 'letterSpacing': '-0.02em' }}>
                  {totalPrograms > 0 ? totalPrograms : programs.length} Results</h2>

                {/* Mobile Filter Toggle Button */}
                <button
                  className="mobile-filter-toggle btn-outline"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <span style={{ fontSize: '16px' }}>⚙️</span> Filters
                </button>
                <div style={{ 'fontSize': '14px', 'color': 'var(--text-secondary)', 'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'position': 'relative' }} ref={sortRef}>
                  <span>Sort by:</span>
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    style={{ 'border': 'none', 'background': 'transparent', 'fontWeight': 'bold', 'color': 'var(--primary)', 'cursor': 'pointer', 'fontFamily': 'inherit', 'display': 'flex', 'alignItems': 'center', 'gap': '4px', 'padding': '4px 8px', 'borderRadius': 'var(--radius-sm)' }}
                  >
                    {sortBy} <ChevronDown size={14} />
                  </button>

                  {sortOpen && (
                    <div style={{ 'position': 'absolute', 'top': '100%', 'right': '0', 'marginTop': '4px', 'background': 'white', 'border': '1px solid var(--border)', 'borderRadius': 'var(--radius-md)', 'boxShadow': 'var(--shadow-md)', 'zIndex': '50', 'minWidth': '140px', 'overflow': 'hidden', 'animation': 'fadeIn 0.2s ease' }}>
                      {['Relevancy', 'Rating', 'Deadline'].map(option => (
                        <button
                          key={option}
                          onClick={() => { setSortBy(option); setSortOpen(false); }}
                          style={{ 'width': '100%', 'textAlign': 'left', 'padding': '10px 16px', 'background': sortOpen && sortBy === option ? 'var(--border-light)' : 'transparent', 'border': 'none', 'cursor': 'pointer', 'fontSize': '14px', 'color': sortBy === option ? 'var(--primary)' : 'var(--text-secondary)', 'fontWeight': sortBy === option ? '600' : '500', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center' }}
                        >
                          {option}
                          {sortBy === option && <Check size={14} color="var(--primary)" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="l1-grid">
                {programs.map((prog, idx) => (
                  <div key={prog.id || idx} className={`card program-card ${idx % 2 === 0 ? 'accent-top' : 'primary-top'}`} onClick={() => navigate(`/program/${prog.id}`)} style={{ 'cursor': 'pointer' }}>
                    <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'flex-start', 'marginBottom': '15px' }}>
                      <div style={{ 'display': 'flex', 'gap': '15px' }}>
                        <div style={{ 'width': '56px', 'height': '56px', 'background': 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', 'borderRadius': 'var(--radius-md)', 'border': '1px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '24px', 'color': 'var(--text-secondary)', 'overflow': 'hidden' }}>
                          {prog.logo_url ? <img src={prog.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : (prog.type === 'COMPETITION' ? '🏆' : '🎓')}
                        </div>
                        <div>
                          <h3 style={{ 'margin': '0 0 4px 0', 'fontSize': '17px', 'color': 'var(--primary)', 'fontWeight': '700' }}>
                            {prog.name}</h3>
                          <div style={{ 'fontSize': '13px', 'color': 'var(--text-secondary)', 'fontWeight': '500' }}>
                            {prog.provider?.name || prog.provider}</div>
                        </div>
                      </div>
                      <span className="action-icon">☆</span>
                    </div>
                    <div style={{ 'marginBottom': '15px', 'display': 'flex', 'flexWrap': 'wrap', 'gap': '6px' }}>
                      {prog.interests && prog.interests.slice(0, 3).map((i, idx2) => (
                        <span key={idx2} className="tag">{i.interest?.name || i.interest}</span>
                      ))}
                      {prog.eligible_grades && <span className="tag">Grades {prog.eligible_grades}</span>}
                    </div>
                    <div style={{ 'marginTop': 'auto', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'paddingTop': '15px', 'borderTop': '1px solid var(--border-light)' }}>
                      <div style={{ 'display': 'flex', 'gap': '4px', 'flexWrap': 'wrap' }}>
                        {prog.impact_rating && <span className="badge-impact">High Impact</span>}
                        {prog.experts_choice_rating === 'MOST_RECOMMENDED' && <span className="badge-most">Most Recommended</span>}
                        {prog.experts_choice_rating === 'HIGHLY_RECOMMENDED' && <span className="badge-highly">Highly Recommended</span>}
                      </div>
                      <div style={{ 'fontSize': '13px', 'fontWeight': 'bold', 'color': 'var(--accent)' }}>View details →</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pagination">
                <button>Previous</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <span style={{ 'padding': '8px 4px', 'color': 'var(--text-secondary)' }}>...</span>
                <button>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
