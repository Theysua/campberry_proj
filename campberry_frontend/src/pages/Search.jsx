import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronDown, Check, MapPin, LocateFixed } from 'lucide-react'
import useScrollReveal from '../hooks/useScrollReveal'
import { getInterests, getPrograms } from '../services/api'
import {
  areArraysEqual,
  areCoordsEqual,
  buildSearchParamsFromState,
  parseSearchStateFromParams,
  sortToApiValue,
} from '../utils/searchUrlState'
import { buildProgramDetailPath, getBackTarget } from '../utils/navigationContext'

const SORT_OPTIONS = ['Relevancy', 'Rating', 'Deadline', 'Distance']

const getProgramLocationMeta = (program) => {
  const sessions = program.sessions || []
  if (sessions.length === 0) {
    return {
      label: 'Location TBD',
      hasOnline: false,
      hasPhysical: false,
    }
  }

  const hasOnline = sessions.some((session) => session.location_type === 'ONLINE')
  const firstPhysicalSession = sessions.find((session) => session.location_type !== 'ONLINE')

  if (hasOnline && firstPhysicalSession) {
    return {
      label: 'Online + In Person',
      hasOnline: true,
      hasPhysical: true,
    }
  }

  if (hasOnline) {
    return {
      label: 'Online',
      hasOnline: true,
      hasPhysical: false,
    }
  }

  return {
    label: firstPhysicalSession?.location_name || 'Location TBD',
    hasOnline: false,
    hasPhysical: Boolean(firstPhysicalSession),
  }
}

const getVisiblePageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items = [1]
  const windowStart = Math.max(2, currentPage - 1)
  const windowEnd = Math.min(totalPages - 1, currentPage + 1)

  if (windowStart > 2) {
    items.push('start-ellipsis')
  }

  for (let pageNumber = windowStart; pageNumber <= windowEnd; pageNumber += 1) {
    items.push(pageNumber)
  }

  if (windowEnd < totalPages - 1) {
    items.push('end-ellipsis')
  }

  items.push(totalPages)
  return items
}

export default function Search() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  useScrollReveal()

  const [sortOpen, setSortOpen] = useState(false)
  const [sortBy, setSortBy] = useState('Relevancy')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isUrlStateReady, setIsUrlStateReady] = useState(false)
  const sortRef = useRef(null)

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [isFree, setIsFree] = useState(false)
  const [isSelective, setIsSelective] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [internationalFilter, setInternationalFilter] = useState(false)
  const [creditFilter, setCreditFilter] = useState(false)
  const [oneOnOneFilter, setOneOnOneFilter] = useState(false)
  const [includeOnline, setIncludeOnline] = useState(true)
  const [seasonFilter, setSeasonFilter] = useState('')
  const [gradesFilter, setGradesFilter] = useState([])
  const [interestIds, setInterestIds] = useState([])
  const [radiusMiles, setRadiusMiles] = useState('25')
  const [currentCoords, setCurrentCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState('')
  const [locationError, setLocationError] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [programs, setPrograms] = useState([])
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [allInterests, setAllInterests] = useState([])
  const visiblePageItems = getVisiblePageItems(page, totalPages || 1)
  const backTarget = getBackTarget(location, '/', 'Back to Home')
  const isLocationSearchWithOnline = Boolean((currentCoords || locationInput.trim()) && includeOnline && !onlineOnly)
  const resultsHeading = isLocationSearchWithOnline ? `${totalPrograms} Results (nearby + online)` : `${totalPrograms} Results`

  useEffect(() => {
    const nextState = parseSearchStateFromParams(searchParams)

    setSearchInput((current) => (current === nextState.searchInput ? current : nextState.searchInput))
    setSearchQuery((current) => (current === nextState.searchQuery ? current : nextState.searchQuery))
    setTypeFilter((current) => (current === nextState.typeFilter ? current : nextState.typeFilter))
    setRatingFilter((current) => (current === nextState.ratingFilter ? current : nextState.ratingFilter))
    setIsFree((current) => (current === nextState.isFree ? current : nextState.isFree))
    setIsSelective((current) => (current === nextState.isSelective ? current : nextState.isSelective))
    setLocationInput((current) => (current === nextState.locationInput ? current : nextState.locationInput))
    setOnlineOnly((current) => (current === nextState.onlineOnly ? current : nextState.onlineOnly))
    setInternationalFilter((current) =>
      current === nextState.internationalFilter ? current : nextState.internationalFilter
    )
    setCreditFilter((current) => (current === nextState.creditFilter ? current : nextState.creditFilter))
    setOneOnOneFilter((current) => (current === nextState.oneOnOneFilter ? current : nextState.oneOnOneFilter))
    setIncludeOnline((current) => (current === nextState.includeOnline ? current : nextState.includeOnline))
    setSeasonFilter((current) => (current === nextState.seasonFilter ? current : nextState.seasonFilter))
    setGradesFilter((current) => (areArraysEqual(current, nextState.gradesFilter) ? current : nextState.gradesFilter))
    setInterestIds((current) => (areArraysEqual(current, nextState.interestIds) ? current : nextState.interestIds))
    setRadiusMiles((current) => (current === nextState.radiusMiles ? current : nextState.radiusMiles))
    setCurrentCoords((current) => (areCoordsEqual(current, nextState.currentCoords) ? current : nextState.currentCoords))
    setLocationStatus((current) => (current === nextState.locationStatus ? current : nextState.locationStatus))
    setLocationError((current) => (current === nextState.locationError ? current : nextState.locationError))
    setSortBy((current) => (current === nextState.sortBy ? current : nextState.sortBy))
    setPage((current) => (current === nextState.page ? current : nextState.page))
    setIsUrlStateReady(true)
  }, [searchParams])

  useEffect(() => {
    if (!isUrlStateReady) {
      return
    }

    const nextParams = buildSearchParamsFromState({
      searchQuery,
      typeFilter,
      ratingFilter,
      isFree,
      isSelective,
      locationInput,
      onlineOnly,
      internationalFilter,
      creditFilter,
      oneOnOneFilter,
      includeOnline,
      seasonFilter,
      gradesFilter,
      interestIds,
      radiusMiles,
      currentCoords,
      sortBy,
      page,
    })

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true })
    }
  }, [
    isUrlStateReady,
    searchQuery,
    typeFilter,
    ratingFilter,
    isFree,
    isSelective,
    locationInput,
    onlineOnly,
    internationalFilter,
    creditFilter,
    oneOnOneFilter,
    includeOnline,
    seasonFilter,
    gradesFilter,
    interestIds,
    radiusMiles,
    currentCoords,
    sortBy,
    page,
    searchParams,
    setSearchParams,
  ])

  useEffect(() => {
    if (!isUrlStateReady) {
      return
    }

    getPrograms({
      search: searchQuery || undefined,
      type: typeFilter || undefined,
      rating: ratingFilter || undefined,
      isFree: isFree ? true : undefined,
      isSelective: isSelective ? true : undefined,
      locationQuery: locationInput || undefined,
      season: seasonFilter || undefined,
      onlineOnly: onlineOnly ? true : undefined,
      includeOnline: includeOnline ? 'true' : 'false',
      grades: gradesFilter.length > 0 ? gradesFilter.join(',') : undefined,
      interests: interestIds.length > 0 ? interestIds.join(',') : undefined,
      international: internationalFilter ? true : undefined,
      collegeCredit: creditFilter ? true : undefined,
      oneOnOne: oneOnOneFilter ? true : undefined,
      lat: currentCoords?.lat,
      lng: currentCoords?.lng,
      radiusMiles: currentCoords ? radiusMiles : undefined,
      sort: sortToApiValue(sortBy),
      page,
      limit: 10,
    })
      .then((res) => {
        setPrograms(res.data || [])
        if (res.meta) {
          setTotalPrograms(res.meta.total || 0)
          setTotalPages(res.meta.totalPages || 1)
        }
      })
      .catch((error) => console.error('Failed to load programs', error))
  }, [
    isUrlStateReady,
    searchQuery,
    typeFilter,
    ratingFilter,
    isFree,
    isSelective,
    locationInput,
    seasonFilter,
    onlineOnly,
    includeOnline,
    gradesFilter,
    interestIds,
    internationalFilter,
    creditFilter,
    oneOnOneFilter,
    currentCoords,
    radiusMiles,
    sortBy,
    page,
  ])

  useEffect(() => {
    getInterests()
      .then((data) => setAllInterests(data))
      .catch((error) => console.error('Failed to fetch interests', error))
  }, [])

  useEffect(() => {
    const handler = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearchClick = () => {
    setSearchQuery(searchInput.trim())
    setPage(1)
  }

  const handleResetFilters = () => {
    setSearchInput('')
    setSearchQuery('')
    setTypeFilter('')
    setRatingFilter('')
    setIsFree(false)
    setIsSelective(false)
    setLocationInput('')
    setSeasonFilter('')
    setOnlineOnly(false)
    setIncludeOnline(true)
    setGradesFilter([])
    setInterestIds([])
    setInternationalFilter(false)
    setCreditFilter(false)
    setOneOnOneFilter(false)
    setRadiusMiles('25')
    setCurrentCoords(null)
    setLocationStatus('')
    setLocationError('')
    setSortBy('Relevancy')
    setPage(1)
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('This browser does not support geolocation.')
      return
    }

    setLocationError('')
    setLocationStatus('Detecting your location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoords({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        })
        setLocationStatus('Using your current location')
        setPage(1)
      },
      () => {
        setLocationStatus('')
        setLocationError('Unable to access your location.')
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  return (
    <div className="page" id="page-search">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 40px 24px' }}>
        <button className="btn-outline" onClick={() => navigate(backTarget.path)} style={{ marginBottom: '20px', fontSize: '13px', padding: '6px 18px' }}>
          {backTarget.label}
        </button>

        <div className="hero-search" style={{ margin: '0 0 30px 0', maxWidth: '100%' }}>
          <input
            placeholder="Search over 1,000 opportunities..."
            style={{ padding: '18px 24px', color: 'var(--text)' }}
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSearchClick()}
          />
          <button onClick={handleSearchClick} style={{ padding: '0 40px' }}>
            Search
          </button>
        </div>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          <div className={`filter-panel ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="filter-panel-header">
              <strong style={{ fontSize: '20px', color: 'var(--primary)', letterSpacing: '-0.02em' }}>Filters</strong>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span onClick={handleResetFilters} style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}>
                  Reset Filters
                </span>
                <button className="mobile-close-filter" onClick={() => setIsMobileFilterOpen(false)}>
                  ×
                </button>
              </div>
            </div>

            <details className="filter-accordion" open>
              <summary className="accordion-header" style={{ borderTop: 'none', marginTop: '0', paddingTop: '0' }}>
                Quick filters <span className="chevron">▾</span>
              </summary>

              <div style={{ marginTop: '15px' }}>
                <div className="filter-section-title">Expert&apos;s Review</div>
                <div className="segmented-control">
                  <button
                    className={`segmented-btn ${ratingFilter === 'MOST_RECOMMENDED' ? 'active shadow-sm' : ''}`}
                    style={{ flexDirection: 'column', background: ratingFilter === 'MOST_RECOMMENDED' ? 'white' : 'transparent', borderColor: ratingFilter === 'MOST_RECOMMENDED' ? 'var(--border)' : 'transparent' }}
                    onClick={() => {
                      setRatingFilter((prev) => (prev === 'MOST_RECOMMENDED' ? '' : 'MOST_RECOMMENDED'))
                      setPage(1)
                    }}
                  >
                    Most
                    <br />
                    Recommended
                  </button>
                  <button
                    className={`segmented-btn ${ratingFilter === 'HIGHLY_RECOMMENDED' ? 'active shadow-sm' : ''}`}
                    style={{ flexDirection: 'column', background: ratingFilter === 'HIGHLY_RECOMMENDED' ? 'white' : 'transparent', borderColor: ratingFilter === 'HIGHLY_RECOMMENDED' ? 'var(--border)' : 'transparent' }}
                    onClick={() => {
                      setRatingFilter((prev) => (prev === 'HIGHLY_RECOMMENDED' ? '' : 'HIGHLY_RECOMMENDED'))
                      setPage(1)
                    }}
                  >
                    Highly
                    <br />
                    Recommended
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title">Type</div>
                <div className="segmented-control">
                  <button
                    className={`segmented-btn ${typeFilter === 'PROGRAM' ? 'active shadow-sm' : ''}`}
                    style={{ background: typeFilter === 'PROGRAM' ? 'white' : 'transparent', borderColor: typeFilter === 'PROGRAM' ? 'var(--border)' : 'transparent' }}
                    onClick={() => {
                      setTypeFilter((prev) => (prev === 'PROGRAM' ? '' : 'PROGRAM'))
                      setPage(1)
                    }}
                  >
                    Program
                  </button>
                  <button
                    className={`segmented-btn ${typeFilter === 'COMPETITION' ? 'active shadow-sm' : ''}`}
                    style={{ background: typeFilter === 'COMPETITION' ? 'white' : 'transparent', borderColor: typeFilter === 'COMPETITION' ? 'var(--border)' : 'transparent' }}
                    onClick={() => {
                      setTypeFilter((prev) => (prev === 'COMPETITION' ? '' : 'COMPETITION'))
                      setPage(1)
                    }}
                  >
                    Competition
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title">Location</div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} />
                  </span>
                  <input
                    className="filter-input"
                    placeholder="City, state, or zip"
                    style={{ paddingLeft: '36px' }}
                    type="text"
                    value={locationInput}
                    onChange={(event) => {
                      setLocationInput(event.target.value)
                      setCurrentCoords(null)
                      setLocationStatus('')
                      setLocationError('')
                      setPage(1)
                    }}
                  />
                </div>
                <button
                  className="location-trigger"
                  onClick={handleUseCurrentLocation}
                >
                  <span className="location-trigger-icon">
                    <LocateFixed size={14} />
                  </span>
                  <span>Use My Location</span>
                </button>
                {locationStatus && <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '8px' }}>{locationStatus}</div>}
                {locationError && <div style={{ fontSize: '12px', color: '#892233', marginTop: '8px' }}>{locationError}</div>}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Radius</span>
                  <select
                    className="filter-input"
                    style={{ width: '90px', padding: '6px 10px', background: 'var(--border-light)', border: 'none', borderRadius: 'var(--radius-sm)' }}
                    value={radiusMiles}
                    onChange={(event) => {
                      setRadiusMiles(event.target.value)
                      setPage(1)
                    }}
                    disabled={!currentCoords}
                  >
                    <option value="5">5 mi</option>
                    <option value="10">10 mi</option>
                    <option value="25">25 mi</option>
                    <option value="50">50 mi</option>
                    <option value="100">100 mi</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    Include Online
                    <input
                      checked={includeOnline}
                      onChange={(event) => {
                        setIncludeOnline(event.target.checked)
                        if (!event.target.checked) {
                          setOnlineOnly(false)
                        }
                        setPage(1)
                      }}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                      type="checkbox"
                    />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    Online Only
                    <input
                      checked={onlineOnly}
                      onChange={(event) => {
                        setOnlineOnly(event.target.checked)
                        if (event.target.checked) {
                          setIncludeOnline(true)
                        }
                        setPage(1)
                      }}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                      type="checkbox"
                    />
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title">Season</div>
                <div className="segmented-control">
                  {['Summer', 'Fall', 'Spring'].map((season) => (
                    <button
                      key={season}
                      className={`segmented-btn ${seasonFilter === season ? 'active shadow-sm' : ''}`}
                      style={{ background: seasonFilter === season ? 'white' : 'transparent', borderColor: seasonFilter === season ? 'var(--border)' : 'transparent' }}
                      onClick={() => {
                        setSeasonFilter((prev) => (prev === season ? '' : season))
                        setPage(1)
                      }}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Current grade
                  <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', background: 'var(--border-light)', padding: '2px 6px', borderRadius: '4px' }}>
                    Multi-select
                  </span>
                </div>
                <div className="segmented-control" style={{ flexWrap: 'wrap' }}>
                  {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                    <button
                      key={grade}
                      className={`segmented-btn ${gradesFilter.includes(String(grade)) ? 'active shadow-sm' : ''}`}
                      style={{ flexDirection: 'row', flexBasis: 'calc(25% - 8px)', background: gradesFilter.includes(String(grade)) ? 'white' : 'transparent', borderColor: gradesFilter.includes(String(grade)) ? 'var(--border)' : 'transparent' }}
                      onClick={() => {
                        setGradesFilter((prev) =>
                          prev.includes(String(grade)) ? prev.filter((value) => value !== String(grade)) : [...prev, String(grade)]
                        )
                        setPage(1)
                      }}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Interests
                  <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', background: 'var(--border-light)', padding: '2px 6px', borderRadius: '4px' }}>
                    Multi-select
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  {allInterests.map((interest) => {
                    const isSelected = interestIds.includes(String(interest.id))
                    return (
                      <button
                        key={interest.id}
                        onClick={() => {
                          setInterestIds((prev) =>
                            isSelected ? prev.filter((id) => id !== String(interest.id)) : [...prev, String(interest.id)]
                          )
                          setPage(1)
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
                          transition: 'all 0.2s',
                        }}
                      >
                        {interest.name} {isSelected && '✓'}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                <label className="checkbox-row">
                  <input type="checkbox" checked={isSelective} onChange={(event) => { setIsSelective(event.target.checked); setPage(1) }} /> Highly Selective
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={isFree} onChange={(event) => { setIsFree(event.target.checked); setPage(1) }} /> Free / Fully Funded
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={internationalFilter} onChange={(event) => { setInternationalFilter(event.target.checked); setPage(1) }} /> Allows International Students
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={creditFilter} onChange={(event) => { setCreditFilter(event.target.checked); setPage(1) }} /> Offers College Credit
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={oneOnOneFilter} onChange={(event) => { setOneOnOneFilter(event.target.checked); setPage(1) }} /> 1-on-1 programs
                </label>
              </div>
            </details>
          </div>

          <div style={{ flex: '1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                {resultsHeading}
              </h2>

              <button className="mobile-filter-toggle btn-outline" onClick={() => setIsMobileFilterOpen(true)}>
                Filters
              </button>

              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }} ref={sortRef}>
                <span>Sort by:</span>
                <button
                  onClick={() => setSortOpen((prev) => !prev)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 'bold', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
                >
                  {sortBy} <ChevronDown size={14} />
                </button>

                {sortOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '4px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: '50', minWidth: '140px', overflow: 'hidden', animation: 'fadeIn 0.2s ease' }}>
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option)
                          setSortOpen(false)
                          setPage(1)
                        }}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: sortBy === option ? 'var(--border-light)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: sortBy === option ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: sortBy === option ? '600' : '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
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
              {programs.map((program, index) => {
                const locationMeta = getProgramLocationMeta(program)
                const distanceLabel =
                  typeof program.distance_miles === 'number' && !locationMeta.hasOnline
                    ? `${program.distance_miles.toFixed(1)} mi away`
                    : null

                return (
                  <div
                    key={program.id || index}
                    className={`card program-card ${index % 2 === 0 ? 'accent-top' : 'primary-top'}`}
                    onClick={() => navigate(buildProgramDetailPath(program.id, location, { returnLabel: 'Back to Results' }))}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', flexShrink: 0, background: program.logo_url ? '#ffffff' : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--text-secondary)', overflow: 'hidden' }}>
                          {program.logo_url ? <img src={program.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} /> : program.type === 'COMPETITION' ? '🏆' : '🎓'}
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', color: 'var(--primary)', fontWeight: '700' }}>{program.name}</h3>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{program.provider?.name || 'Unknown Provider'}</div>
                        </div>
                      </div>
                      <span className="action-icon">☆</span>
                    </div>

                    <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {program.interests?.slice(0, 3).map((interest, interestIndex) => (
                        <span key={interestIndex} className="tag">
                          {interest.interest?.name}
                        </span>
                      ))}
                      {program.eligible_grades && <span className="tag">Grades {program.eligible_grades}</span>}
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                      <span>{locationMeta.label}</span>
                      {distanceLabel && <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{distanceLabel}</span>}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {program.impact_rating && <span className="badge-impact">High Impact</span>}
                        {program.experts_choice_rating === 'MOST_RECOMMENDED' && <span className="badge-most">Most Recommended</span>}
                        {program.experts_choice_rating === 'HIGHLY_RECOMMENDED' && <span className="badge-highly">Highly Recommended</span>}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)' }}>View details →</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {programs.length === 0 && (
              <div className="card" style={{ marginTop: '20px', textAlign: 'center', padding: '40px 24px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>No matching programs</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Try widening your filters or removing the location constraint.</p>
              </div>
            )}

            <div className="pagination" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '30px' }}>
              <button
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={page === 1}
                className="btn-outline"
                style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <div className="pagination-pages">
                {visiblePageItems.map((item) =>
                  typeof item === 'number' ? (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={page === item ? 'btn' : 'btn-outline'}
                      style={{
                        width: '36px',
                        height: '36px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={item} className="pagination-ellipsis">
                      ...
                    </span>
                  )
                )}
              </div>
              <button
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                disabled={page >= totalPages}
                className="btn-outline"
                style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
