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
  const sortRef = useRef(null);

  // Filter States
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [isSelective, setIsSelective] = useState(false);

  // New Filter States
  const [zipCodeFilter, setZipCodeFilter] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [internationalFilter, setInternationalFilter] = useState(false);
  const [creditFilter, setCreditFilter] = useState(false);
  const [oneOnOneFilter, setOneOnOneFilter] = useState(false);
  const [includeOnline, setIncludeOnline] = useState(true);
  const [seasonFilter, setSeasonFilter] = useState('');
  const [gradesFilter, setGradesFilter] = useState([]);
  const [interestIds, setInterestIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [programs, setPrograms] = useState([]);
  const [totalPrograms, setTotalPrograms] = useState(0);

  // Data States
  const [allInterests, setAllInterests] = useState([]);

  useEffect(() => {
    getPrograms({
      search: searchQuery || undefined,
      type: typeFilter || undefined,
      rating: ratingFilter || undefined,
      isFree: isFree ? true : undefined,
      isSelective: isSelective ? true : undefined,
      zip: zipCodeFilter || undefined,
      season: seasonFilter || undefined,
      onlineOnly: onlineOnly ? true : undefined,
      includeOnline: includeOnline ? true : undefined,
      grades: gradesFilter.length > 0 ? gradesFilter.join(',') : undefined,
      interests: interestIds.length > 0 ? interestIds.join(',') : undefined,
      international: internationalFilter ? true : undefined,
      collegeCredit: creditFilter ? true : undefined,
      oneOnOne: oneOnOneFilter ? true : undefined,
      page,
      limit: 10
    }).then(res => {
      setPrograms(res.data || []);
      if (res.meta) {
        setTotalPrograms(res.meta.total || 0);
        setTotalPages(res.meta.totalPages || 1);
      }
    }).catch(err => console.error("Failed to load programs", err));
  }, [searchQuery, typeFilter, ratingFilter, isFree, isSelective, zipCodeFilter, seasonFilter, onlineOnly, includeOnline, gradesFilter, interestIds, internationalFilter, creditFilter, oneOnOneFilter, page]);

  // Fetch initial data like interests
  useEffect(() => {
    fetch('http://localhost:3001/api/v1/public/interests')
      .then(res => res.json())
      .then(data => setAllInterests(data))
      .catch(e => console.error("Failed to fetch interests", e));
  }, []);

  const handleSearchClick = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setTypeFilter('');
    setRatingFilter('');
    setIsFree(false);
    setIsSelective(false);
    setZipCodeFilter('');
    setSeasonFilter('');
    setOnlineOnly(false);
    setIncludeOnline(true);
    setGradesFilter([]);
    setInterestIds([]);
    setInternationalFilter(false);
    setCreditFilter(false);
    setOneOnOneFilter(false);
    setPage(1);
  };

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
            <input
              placeholder="Search over 1,000 opportunities..."
              style={{ 'padding': '18px 24px', 'color': 'var(--text)' }}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            />
            <button onClick={handleSearchClick} style={{ 'padding': '0 40px' }}>Search</button>
          </div>
          <div style={{ 'display': 'flex', 'gap': '30px', 'alignItems': 'flex-start' }}>
            {/* Left Sidebar Filters - Hidden on mobile unless open */}
            <div className={`filter-panel ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
              <div className="filter-panel-header">
                <strong style={{ 'fontSize': '20px', 'color': 'var(--primary)', 'letterSpacing': '-0.02em' }}>Filters</strong>
                <div style={{ 'display': 'flex', 'gap': '16px', 'alignItems': 'center' }}>
                  <span onClick={handleResetFilters} style={{ 'fontSize': '13px', 'color': 'var(--accent)', 'cursor': 'pointer', 'fontWeight': '600' }}>Reset Filters</span>
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
                    <button
                      className={`segmented-btn ${ratingFilter === 'MOST_RECOMMENDED' ? 'active shadow-sm' : ''}`}
                      style={{ flexDirection: 'column', background: ratingFilter === 'MOST_RECOMMENDED' ? 'white' : 'transparent', borderColor: ratingFilter === 'MOST_RECOMMENDED' ? 'var(--border)' : 'transparent' }}
                      onClick={() => setRatingFilter(prev => prev === 'MOST_RECOMMENDED' ? '' : 'MOST_RECOMMENDED')}
                    >
                      Most<br />Recommended
                    </button>
                    <button
                      className={`segmented-btn ${ratingFilter === 'HIGHLY_RECOMMENDED' ? 'active shadow-sm' : ''}`}
                      style={{ flexDirection: 'column', background: ratingFilter === 'HIGHLY_RECOMMENDED' ? 'white' : 'transparent', borderColor: ratingFilter === 'HIGHLY_RECOMMENDED' ? 'var(--border)' : 'transparent' }}
                      onClick={() => setRatingFilter(prev => prev === 'HIGHLY_RECOMMENDED' ? '' : 'HIGHLY_RECOMMENDED')}
                    >
                      High<br />Impact
                    </button>
                  </div>
                </div>
                {/* Type */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Type</div>
                  <div className="segmented-control">
                    <button
                      className={`segmented-btn ${typeFilter === 'PROGRAM' ? 'active shadow-sm' : ''}`}
                      style={{ background: typeFilter === 'PROGRAM' ? 'white' : 'transparent', borderColor: typeFilter === 'PROGRAM' ? 'var(--border)' : 'transparent' }}
                      onClick={() => setTypeFilter(prev => prev === 'PROGRAM' ? '' : 'PROGRAM')}
                    >
                      <span style={{ 'fontSize': '16px' }}>🎓</span>
                      Program
                    </button>
                    <button
                      className={`segmented-btn ${typeFilter === 'COMPETITION' ? 'active shadow-sm' : ''}`}
                      style={{ background: typeFilter === 'COMPETITION' ? 'white' : 'transparent', borderColor: typeFilter === 'COMPETITION' ? 'var(--border)' : 'transparent' }}
                      onClick={() => setTypeFilter(prev => prev === 'COMPETITION' ? '' : 'COMPETITION')}
                    >
                      <span style={{ 'fontSize': '16px' }}>🏆</span>
                      Competition
                    </button>
                  </div>
                </div>
                {/* Location (Temporarily Hidden)
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Location</div>
                  <div style={{ 'position': 'relative' }}>
                    <span style={{ 'position': 'absolute', 'left': '12px', 'top': '11px', 'color': 'var(--text-secondary)' }}>📍</span>
                    <input
                      className="filter-input"
                      placeholder="Enter a zip code..."
                      style={{ 'paddingLeft': '36px' }}
                      type="text"
                      value={zipCodeFilter}
                      onChange={(e) => setZipCodeFilter(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
                    />
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
                      Include Online <input checked={includeOnline} onChange={(e) => { setIncludeOnline(e.target.checked); if (!e.target.checked) setOnlineOnly(false); setPage(1); }} style={{ 'width': '16px', 'height': '16px', 'accentColor': 'var(--accent)' }} type="checkbox" />
                    </label>
                    <label style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'cursor': 'pointer' }}>
                      Online Only <input checked={onlineOnly} onChange={(e) => { setOnlineOnly(e.target.checked); if (e.target.checked) setIncludeOnline(true); setPage(1); }} style={{ 'width': '16px', 'height': '16px', 'accentColor': 'var(--accent)' }} type="checkbox" />
                    </label>
                  </div>
                </div>
                */}
                {/* Season */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title">Season</div>
                  <div className="segmented-control">
                    <button className={`segmented-btn ${seasonFilter === 'Summer' ? 'active shadow-sm' : ''}`} style={{ background: seasonFilter === 'Summer' ? 'white' : 'transparent', borderColor: seasonFilter === 'Summer' ? 'var(--border)' : 'transparent' }} onClick={() => { setSeasonFilter(prev => prev === 'Summer' ? '' : 'Summer'); setPage(1); }}>☀️<br />Summer</button>
                    <button className={`segmented-btn ${seasonFilter === 'Fall' ? 'active shadow-sm' : ''}`} style={{ background: seasonFilter === 'Fall' ? 'white' : 'transparent', borderColor: seasonFilter === 'Fall' ? 'var(--border)' : 'transparent' }} onClick={() => { setSeasonFilter(prev => prev === 'Fall' ? '' : 'Fall'); setPage(1); }}>🍂<br />Fall</button>
                    <button className={`segmented-btn ${seasonFilter === 'Spring' ? 'active shadow-sm' : ''}`} style={{ background: seasonFilter === 'Spring' ? 'white' : 'transparent', borderColor: seasonFilter === 'Spring' ? 'var(--border)' : 'transparent' }} onClick={() => { setSeasonFilter(prev => prev === 'Spring' ? '' : 'Spring'); setPage(1); }}>🌱<br />Spring</button>
                  </div>
                </div>
                {/* Grade */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Current grade <span style={{ 'color': 'var(--accent)', 'cursor': 'pointer', 'fontWeight': 'normal' }}>?</span>
                    <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', background: 'var(--border-light)', padding: '2px 6px', borderRadius: '4px' }}>Multi-select</span>
                  </div>
                  <div className="segmented-control" style={{ flexWrap: 'wrap' }}>
                    {[6, 7, 8, 9, 10, 11, 12].map(g => (
                      <button
                        key={g}
                        className={`segmented-btn ${gradesFilter.includes(String(g)) ? 'active shadow-sm' : ''}`}
                        style={{ 'flexDirection': 'row', 'flexBasis': 'calc(25% - 8px)', background: gradesFilter.includes(String(g)) ? 'white' : 'transparent', borderColor: gradesFilter.includes(String(g)) ? 'var(--border)' : 'transparent' }}
                        onClick={() => {
                          setGradesFilter(prev => prev.includes(String(g)) ? prev.filter(x => x !== String(g)) : [...prev, String(g)]);
                          setPage(1);
                        }}
                      >{g}</button>
                    ))}
                  </div>
                </div>
                {/* Interests */}
                <div style={{ 'marginTop': '20px' }}>
                  <div className="filter-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Interests
                    <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', background: 'var(--border-light)', padding: '2px 6px', borderRadius: '4px' }}>Multi-select</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {allInterests.map(interest => {
                      const isSelected = interestIds.includes(String(interest.id));
                      return (
                        <button
                          key={interest.id}
                          onClick={() => {
                            setInterestIds(prev => isSelected ? prev.filter(id => id !== String(interest.id)) : [...prev, String(interest.id)]);
                            setPage(1);
                          }}
                          className={`tag ${isSelected ? 'shadow-sm' : ''}`}
                          style={{
                            background: isSelected ? 'var(--primary)' : 'var(--bg-alt)',
                            color: isSelected ? 'white' : 'var(--text)',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            transition: 'all 0.2s'
                          }}
                        >
                          {interest.name} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Advanced Criteria */}
                <div style={{ 'marginTop': '15px', 'paddingTop': '15px', 'borderTop': '1px solid var(--border)' }}>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={isSelective} onChange={e => { setIsSelective(e.target.checked); setPage(1); }} /> Highly Selective
                  </label>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={isFree} onChange={e => { setIsFree(e.target.checked); setPage(1); }} /> Free / Fully Funded
                  </label>
                  <label className="checkbox-row"><input type="checkbox" checked={internationalFilter} onChange={e => { setInternationalFilter(e.target.checked); setPage(1); }} /> Allows International Students</label>
                  <label className="checkbox-row"><input type="checkbox" checked={creditFilter} onChange={e => { setCreditFilter(e.target.checked); setPage(1); }} /> Offers College Credit</label>
                  <label className="checkbox-row"><input type="checkbox" checked={oneOnOneFilter} onChange={e => { setOneOnOneFilter(e.target.checked); setPage(1); }} /> 1-on-1 programs</label>
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
                        <div style={{ 'width': '56px', 'height': '56px', 'minWidth': '56px', 'minHeight': '56px', 'flexShrink': 0, 'background': prog.logo_url ? '#ffffff' : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', 'borderRadius': 'var(--radius-md)', 'border': '1px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '24px', 'color': 'var(--text-secondary)', 'overflow': 'hidden' }}>
                          {prog.logo_url ? <img src={prog.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} /> : (prog.type === 'COMPETITION' ? '🏆' : '🎓')}
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
              <div className="pagination" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '30px' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-outline"
                  style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >← Previous</button>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={page === p ? 'btn' : 'btn-outline'}
                      style={{
                        width: '36px',
                        height: '36px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="btn-outline"
                  style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                >Next →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
