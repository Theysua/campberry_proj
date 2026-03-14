/* eslint-disable react-hooks/set-state-in-effect */
import { Check, ChevronDown, Star, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useScrollReveal from '../hooks/useScrollReveal'
import { getInterests, getPrograms } from '../services/api'
import { buildProgramDetailPath, getBackTarget } from '../utils/navigationContext'
import { canGuestAccessProgram } from '../utils/previewGate'
import { getProgramStarRating } from '../utils/programRating'
import {
  areArraysEqual,
  buildSearchParamsFromState,
  parseSearchStateFromParams,
  sortToApiValue,
} from '../utils/searchUrlState'

const SORT_OPTIONS = ['Relevancy', 'Selectivity', 'Deadline (Ascending)', 'Deadline (Descending)']
const GUEST_LOCK_PREVIEW_CARDS = 2

const getLocationMeta = (program) => {
  const sessions = program.sessions || []
  if (sessions.length === 0) return { label: 'Location TBD', hasOnline: false }
  const hasOnline = sessions.some((session) => session.location_type === 'ONLINE')
  const firstPhysical = sessions.find((session) => session.location_type !== 'ONLINE')
  if (hasOnline && firstPhysical) return { label: 'Online + In Person', hasOnline: true }
  if (hasOnline) return { label: 'Online', hasOnline: true }
  return { label: firstPhysical?.location_name || 'Location TBD', hasOnline: false }
}

const getVisiblePageItems = (currentPage, totalPages) => {
  const items = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  
  if (start > 1) {
    items.push(1)
    if (start > 2) items.push('start-ellipsis')
  }
  
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    items.push(pageNumber)
  }
  
  if (end < totalPages) {
    items.push('end-ellipsis')
  }

  return items
}

const SkeletonCard = ({ accentClass }) => (
  <div className={`card program-card ${accentClass}`} style={{ pointerEvents: 'none' }}>
    <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--border-light)' }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '70%', height: '18px', borderRadius: '999px', background: 'var(--border-light)', marginBottom: '10px' }} />
        <div style={{ width: '42%', height: '12px', borderRadius: '999px', background: 'var(--border-light)' }} />
      </div>
    </div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
      {[1, 2, 3].map((item) => <div key={item} style={{ width: '84px', height: '28px', borderRadius: '999px', background: 'var(--border-light)' }} />)}
    </div>
    <div style={{ width: '38%', height: '12px', borderRadius: '999px', background: 'var(--border-light)', marginBottom: '8px' }} />
    <div style={{ width: '28%', height: '12px', borderRadius: '999px', background: 'var(--border-light)', marginBottom: '18px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border-light)' }}>
      <div style={{ width: '140px', height: '32px', borderRadius: '999px', background: 'var(--border-light)' }} />
      <div style={{ width: '92px', height: '12px', borderRadius: '999px', background: 'var(--border-light)' }} />
    </div>
  </div>
)

const LockedPreviewCard = ({ program, accentClass }) => {
  if (!program) return <SkeletonCard accentClass={accentClass} />

  const locationMeta = getLocationMeta(program)
  const primaryTags = [program.category, ...(program.interests || []).slice(0, 2).map((interest) => interest.name)].filter(Boolean).slice(0, 3)

  return (
    <div className={`card program-card ${accentClass}`}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--border-light)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {program.provider?.logo_url ? (
            <img src={program.provider.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{(program.provider?.name || program.title || '?').slice(0, 2).toUpperCase()}</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1.2', color: 'var(--primary)', marginBottom: '8px' }}>{program.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{program.provider?.name || 'Campberry partner'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {primaryTags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
      </div>

      <div className="search-card-footer">
        <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: '800' }}>
            {program.deadlines?.[0]?.display || 'Upcoming deadline'}
          </span>
          <span style={{ fontSize: '13px' }}>{locationMeta.label}</span>
        </div>

        <div className="search-card-actions">
          <div className="search-card-badges" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginBottom: '12px' }}>
            {program.isMostRecommended && <span className="badge-most">Most Recommended</span>}
            {program.isSelective && <span className="badge-highly">Highly Selective</span>}
          </div>
          <div className="search-card-meta-actions">
            <span className="search-card-website">Website</span>
          </div>
          <div className="search-card-detail-cta">View details →</div>
        </div>
      </div>
    </div>
  )
}

const LockedSearchPanel = ({ hiddenCount, onRegister }) => (
  <div className="search-lock-panel" onClick={onRegister} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onRegister()} style={{ cursor: 'pointer' }}>
    <div className="search-lock-fade-overlay" aria-hidden="true" />
    
    <div className="search-lock-content">
      <div className="search-lock-text-column">
        <h3 className="search-lock-title">Keep browsing Campberry with a free account.</h3>
        <p className="search-lock-desc">
          Save your research, unlock all results, and keep building lists.
        </p>
      </div>
      
      <div className="search-lock-action-column">
        <button className="search-lock-button" type="button">
          <span className="search-lock-google-mark" aria-hidden="true">G</span>
          Continue with Google
        </button>
        <button className="search-lock-button search-lock-button-secondary" type="button">
          Continue with email
        </button>
      </div>
      
      <div className="search-lock-signin">
        Have an existing Campberry account?{' '}
        <button className="search-lock-signin-link" onClick={(e) => {
          e.stopPropagation();
          onRegister();
        }} type="button">
          Sign in here
        </button>
      </div>
    </div>
  </div>
)

export default function Search() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  useScrollReveal()

  const [referenceNow] = useState(() => Date.now())
  const [sortOpen, setSortOpen] = useState(false)
  const [sortBy, setSortBy] = useState('Relevancy')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isUrlStateReady, setIsUrlStateReady] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [impactFilter, setImpactFilter] = useState('')
  const [isSelective, setIsSelective] = useState(false)
  const [internationalFilter, setInternationalFilter] = useState(false)
  const [creditFilter, setCreditFilter] = useState(false)
  const [seasonFilter, setSeasonFilter] = useState('')
  const [gradesFilter, setGradesFilter] = useState([])
  const [interestIds, setInterestIds] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [programs, setPrograms] = useState([])
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [resultsMeta, setResultsMeta] = useState({ totalMatches: 0, loginRequiredForMore: false, hiddenCount: 0, guestVisibleLimit: null })
  const [allInterests, setAllInterests] = useState([])
  const [isProgramsLoading, setIsProgramsLoading] = useState(false)
  const [hasLoadedPrograms, setHasLoadedPrograms] = useState(false)

  const sortRef = useRef(null)
  const pageCacheRef = useRef(new Map())
  const requestKeyRef = useRef('')
  const activeRequestRef = useRef(null)
  const backTarget = getBackTarget(location, '/', 'Back to Home')
  const visiblePageItems = getVisiblePageItems(page, totalPages || 1)

  useEffect(() => {
    const nextState = parseSearchStateFromParams(searchParams)
    setSearchInput((current) => (current === nextState.searchInput ? current : nextState.searchInput))
    setSearchQuery((current) => (current === nextState.searchQuery ? current : nextState.searchQuery))
    setTypeFilter((current) => (current === nextState.typeFilter ? current : nextState.typeFilter))
    setRatingFilter((current) => (current === nextState.ratingFilter ? current : nextState.ratingFilter))
    setImpactFilter((current) => (current === nextState.impactFilter ? current : nextState.impactFilter))
    setIsSelective((current) => (current === nextState.isSelective ? current : nextState.isSelective))
    setInternationalFilter((current) => (current === nextState.internationalFilter ? current : nextState.internationalFilter))
    setCreditFilter((current) => (current === nextState.creditFilter ? current : nextState.creditFilter))
    setSeasonFilter((current) => (current === nextState.seasonFilter ? current : nextState.seasonFilter))
    setGradesFilter((current) => (areArraysEqual(current, nextState.gradesFilter) ? current : nextState.gradesFilter))
    setInterestIds((current) => (areArraysEqual(current, nextState.interestIds) ? current : nextState.interestIds))
    setSortBy((current) => (current === nextState.sortBy ? current : nextState.sortBy))
    setPage((current) => (current === nextState.page ? current : nextState.page))
    setIsUrlStateReady(true)
  }, [searchParams])

  useEffect(() => {
    if (!isUrlStateReady) return
    const nextParams = buildSearchParamsFromState({
      searchQuery,
      typeFilter,
      ratingFilter,
      impactFilter,
      isSelective,
      internationalFilter,
      creditFilter,
      seasonFilter,
      gradesFilter,
      interestIds,
      sortBy,
      page,
    })
    if (nextParams.toString() !== searchParams.toString()) setSearchParams(nextParams, { replace: true })
  }, [isUrlStateReady, searchQuery, typeFilter, ratingFilter, impactFilter, isSelective, internationalFilter, creditFilter, seasonFilter, gradesFilter, interestIds, sortBy, page, searchParams, setSearchParams])

  useEffect(() => {
    if (!isUrlStateReady) return undefined
    const queryParams = {
      search: searchQuery || undefined,
      type: typeFilter || undefined,
      rating: ratingFilter || undefined,
      impact: impactFilter || undefined,
      isSelective: isSelective ? true : undefined,
      season: seasonFilter || undefined,
      grades: gradesFilter.length > 0 ? gradesFilter.join(',') : undefined,
      interests: interestIds.length > 0 ? interestIds.join(',') : undefined,
      international: internationalFilter ? true : undefined,
      collegeCredit: creditFilter ? true : undefined,
      ...sortToApiValue(sortBy),
      limit: 10,
    }
    const requestKey = JSON.stringify(queryParams)
    requestKeyRef.current = requestKey
    activeRequestRef.current?.abort()
    const controller = new AbortController()
    activeRequestRef.current = controller

    const loadPage = async (pageNumber, { prefetch = false, signal } = {}) => {
      const cached = pageCacheRef.current.get(requestKey)
      if (cached?.pages?.has(pageNumber)) {
        return { data: cached.pages.get(pageNumber) || [], meta: cached.meta || { total: 0, totalPages: 1 } }
      }

      const response = await getPrograms({ ...queryParams, page: pageNumber }, signal ? { signal } : {})
      const nextCache = pageCacheRef.current.get(requestKey) || { meta: response.meta || { total: 0, totalPages: 1 }, pages: new Map() }
      nextCache.meta = response.meta || nextCache.meta
      nextCache.pages.set(pageNumber, response.data || [])
      pageCacheRef.current.set(requestKey, nextCache)

      if (!prefetch && requestKeyRef.current === requestKey && !signal?.aborted) {
        setPrograms(response.data || [])
        setTotalPrograms(response.meta?.total || 0)
        setTotalPages(response.meta?.totalPages || 1)
        setResultsMeta(response.meta || { totalMatches: 0, loginRequiredForMore: false, hiddenCount: 0, guestVisibleLimit: null })
        setHasLoadedPrograms(true)
      }

      return response
    }

    const primeResults = async () => {
      const cached = pageCacheRef.current.get(requestKey)
      if (cached?.pages?.has(page)) {
        setPrograms(cached.pages.get(page) || [])
        setTotalPrograms(cached.meta?.total || 0)
        setTotalPages(cached.meta?.totalPages || 1)
        setResultsMeta(cached.meta || { totalMatches: 0, loginRequiredForMore: false, hiddenCount: 0, guestVisibleLimit: null })
        setHasLoadedPrograms(true)
      } else {
        await loadPage(page, { signal: controller.signal })
      }

      const activeCache = pageCacheRef.current.get(requestKey)
      const nextPage = page + 1
      if (activeCache?.meta?.totalPages >= nextPage && !activeCache.pages.has(nextPage)) {
        loadPage(nextPage, { prefetch: true }).catch((error) => {
          if (error?.name !== 'AbortError') console.error('Failed to prefetch programs', error)
        })
      }
    }

    setIsProgramsLoading(true)
    primeResults()
      .catch((error) => {
        if (error?.name !== 'AbortError') console.error('Failed to load programs', error)
      })
      .finally(() => {
        if (!controller.signal.aborted && requestKeyRef.current === requestKey) setIsProgramsLoading(false)
      })

    return () => controller.abort()
  }, [isUrlStateReady, searchQuery, typeFilter, ratingFilter, impactFilter, isSelective, seasonFilter, gradesFilter, interestIds, internationalFilter, creditFilter, sortBy, page])

  useEffect(() => {
    getInterests().then(setAllInterests).catch((error) => console.error('Failed to fetch interests', error))
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const resetFilters = () => {
    setSearchInput('')
    setSearchQuery('')
    setTypeFilter('')
    setRatingFilter('')
    setImpactFilter('')
    setIsSelective(false)
    setSeasonFilter('')
    setGradesFilter([])
    setInterestIds([])
    setInternationalFilter(false)
    setCreditFilter(false)
    setSortBy('Relevancy')
    setPage(1)
  }

  const getNextDeadlineLabel = (program) => {
    const deadline = (program.deadlines || [])
      .map((entry) => ({ ...entry, parsedDate: new Date(entry.predictedDate || entry.date) }))
      .filter((entry) => !Number.isNaN(entry.parsedDate.getTime()))
      .sort((left, right) => left.parsedDate.getTime() - right.parsedDate.getTime())[0]

    if (!deadline) {
      return { label: 'Deadline: TBD', tone: 'muted' }
    }

    const diffDays = Math.ceil((deadline.parsedDate.getTime() - referenceNow) / (1000 * 60 * 60 * 24))
    const formatted = deadline.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    if (diffDays < 0) {
      return { label: `Deadline passed (${formatted})`, tone: 'passed' }
    }

    if (diffDays <= 30) {
      return { label: `Deadline soon: ${formatted}`, tone: 'soon' }
    }

    return { label: `Deadline: ${formatted}`, tone: 'normal' }
  }

  const isGuestSearchLocked = !isAuthenticated && Boolean(resultsMeta.loginRequiredForMore)
  const hiddenGuestResultCount = Math.max(0, resultsMeta.hiddenCount || 0)
  const handleRegisterForSearchAccess = () => {
    navigate(`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}&reason=preview_limit`)
  }

  // --- NEW COMPONENT: Expandable Title ---
  const ExpandableTitle = ({ title }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const titleRef = useRef(null);

    useEffect(() => {
      if (titleRef.current) {
        const { scrollHeight, clientHeight } = titleRef.current;
        // Only mark as truncated if the scroll height is significantly larger than the clamped client height,
        // and only update state if it's currently false (prevents continuous re-renders!)
        if (scrollHeight > clientHeight + 5) {
          if (!isTruncated) setIsTruncated(true);
        } else {
          if (isTruncated) setIsTruncated(false);
        }
      }
    }, [title, isTruncated]); // Only re-run when title changes, or handle the initial check

    return (
      <div style={{ position: 'relative', marginBottom: '4px' }} onClick={(e) => e.stopPropagation()}>
        <h3
          ref={titleRef}
          style={{
            margin: '0',
            fontSize: '17px',
            color: 'var(--primary)',
            fontWeight: '700',
            display: '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </h3>
        {isTruncated && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              marginTop: '4px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {isExpanded ? (
              <>Show less <ChevronUp size={12} /></>
            ) : (
              <>Show more <ChevronDown size={12} /></>
            )}
          </button>
        )}
      </div>
    );
  };
  // ----------------------------------------

  const renderProgramCard = (program, index) => {
    const locationMeta = getLocationMeta(program)
    const distanceLabel = typeof program.distance_miles === 'number' && !locationMeta.hasOnline ? `${program.distance_miles.toFixed(1)} mi away` : null
    const starRating = getProgramStarRating(program)
    const deadlineMeta = getNextDeadlineLabel(program)
    const detailPath = buildProgramDetailPath(program.id, location, { returnLabel: 'Back to Results' })

    const handleOpenProgram = () => {
      if (!canGuestAccessProgram(program.id)) {
        navigate(`/auth?redirect=${encodeURIComponent(detailPath)}&reason=preview_limit`)
        return
      }

      navigate(detailPath)
    }

    return (
      <div key={program.id || index} className={`card program-card ${index % 2 === 0 ? 'accent-top' : 'primary-top'}`} onClick={handleOpenProgram} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', flexShrink: 0, background: program.logo_url ? '#ffffff' : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--text-secondary)', overflow: 'hidden' }}>
              {program.logo_url ? <img src={program.logo_url} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} /> : program.type === 'COMPETITION' ? '🏆' : '🎓'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ExpandableTitle title={program.name} />
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{program.provider?.name || 'Unknown Provider'}</div>
            </div>
          </div>
          <span className="action-icon">☆</span>
        </div>

        <div className="search-card-footer" style={{ marginTop: 'auto' }}>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '15px', color: deadlineMeta.tone === 'soon' ? 'var(--accent)' : deadlineMeta.tone === 'normal' ? 'var(--orange)' : 'var(--text-secondary)', fontWeight: '800', textDecoration: deadlineMeta.tone === 'passed' ? 'line-through' : 'none' }}>
              {deadlineMeta.label}
            </span>
            <span style={{ fontSize: '13px' }}>{locationMeta.label}</span>
            {distanceLabel && <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{distanceLabel}</span>}
          </div>

          <div className="search-card-actions">
            <div className="search-card-badges" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginBottom: '12px' }}>
              {program.experts_choice_rating === 'MOST_RECOMMENDED' && <span className="badge-most">Most Recommended</span>}
              {program.experts_choice_rating === 'HIGHLY_RECOMMENDED' && <span className="badge-highly">Highly Recommended</span>}
              {program.is_highly_selective && <span className="badge-highly">Highly Selective</span>}
            </div>

            <div className="search-card-meta-actions">
              {program.url && (
                <a
                  href={program.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="search-card-website"
                >
                  Website
                </a>
              )}
              {starRating > 0 && (
                <div
                  className="search-card-score"
                  aria-label={`Campberry Score ${starRating}`}
                  title={`Campberry Score: ${starRating}`}
                >
                  {Array.from({ length: starRating }).map((_, starIndex) => (
                    <Star key={starIndex} size={14} fill="currentColor" strokeWidth={1.8} />
                  ))}
                </div>
              )}
            </div>

            <div className="search-card-detail-cta">View details →</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page" id="page-search">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 40px 24px' }}>
        <button className="btn-outline" onClick={() => navigate(backTarget.path)} style={{ marginBottom: '20px', fontSize: '13px', padding: '6px 18px' }}>{backTarget.label}</button>

        <div className="hero-search" style={{ margin: '0 0 30px 0', maxWidth: '100%' }}>
          <input placeholder="Search over 1,000 opportunities..." style={{ padding: '18px 24px', color: 'var(--text)' }} type="text" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && (setSearchQuery(searchInput.trim()), setPage(1))} />
          <button onClick={() => { setSearchQuery(searchInput.trim()); setPage(1) }} style={{ padding: '0 40px' }}>Search</button>
        </div>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          <div className={`filter-panel ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="filter-panel-header">
              <strong style={{ fontSize: '20px', color: 'var(--primary)', letterSpacing: '-0.02em' }}>Filters</strong>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span onClick={resetFilters} style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}>Reset Filters</span>
                <button className="mobile-close-filter" onClick={() => setIsMobileFilterOpen(false)}><X size={16} /></button>
              </div>
            </div>

            <details className="filter-accordion" open>
              <summary className="accordion-header" style={{ borderTop: 'none', marginTop: '0', paddingTop: '0' }}>Quick filters <span className="chevron">+</span></summary>

              <div style={{ marginTop: '15px' }}>
                <div className="filter-section-title">Expert&apos;s Review</div>
                <div className="segmented-control">
                  <button className={`segmented-btn ${ratingFilter === 'MOST_RECOMMENDED' ? 'active shadow-sm' : ''}`} style={{ flexDirection: 'column', background: ratingFilter === 'MOST_RECOMMENDED' ? 'white' : 'transparent', borderColor: ratingFilter === 'MOST_RECOMMENDED' ? 'var(--border)' : 'transparent' }} onClick={() => { setRatingFilter((prev) => prev === 'MOST_RECOMMENDED' ? '' : 'MOST_RECOMMENDED'); setPage(1) }}>Most<br />Recommended</button>
                  <button className={`segmented-btn ${ratingFilter === 'HIGHLY_RECOMMENDED' ? 'active shadow-sm' : ''}`} style={{ flexDirection: 'column', background: ratingFilter === 'HIGHLY_RECOMMENDED' ? 'white' : 'transparent', borderColor: ratingFilter === 'HIGHLY_RECOMMENDED' ? 'var(--border)' : 'transparent' }} onClick={() => { setRatingFilter((prev) => prev === 'HIGHLY_RECOMMENDED' ? '' : 'HIGHLY_RECOMMENDED'); setPage(1) }}>Highly<br />Recommended</button>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title">Impact on Admissions</div>
                <div className="segmented-control" style={{ padding: '4px' }}>
                  <button className={`segmented-btn ${impactFilter === 'HIGH_IMPACT' ? 'active shadow-sm' : ''}`} style={{ width: '100%', flexDirection: 'column', background: impactFilter === 'HIGH_IMPACT' ? 'white' : 'transparent', borderColor: impactFilter === 'HIGH_IMPACT' ? 'var(--border)' : 'transparent' }} onClick={() => { setImpactFilter((prev) => prev === 'HIGH_IMPACT' ? '' : 'HIGH_IMPACT'); setPage(1) }}>High Impact</button>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title">Type</div>
                <div className="segmented-control">
                  <button className={`segmented-btn ${typeFilter === 'PROGRAM' ? 'active shadow-sm' : ''}`} style={{ background: typeFilter === 'PROGRAM' ? 'white' : 'transparent', borderColor: typeFilter === 'PROGRAM' ? 'var(--border)' : 'transparent' }} onClick={() => { setTypeFilter((prev) => prev === 'PROGRAM' ? '' : 'PROGRAM'); setPage(1) }}>Program</button>
                  <button className={`segmented-btn ${typeFilter === 'COMPETITION' ? 'active shadow-sm' : ''}`} style={{ background: typeFilter === 'COMPETITION' ? 'white' : 'transparent', borderColor: typeFilter === 'COMPETITION' ? 'var(--border)' : 'transparent' }} onClick={() => { setTypeFilter((prev) => prev === 'COMPETITION' ? '' : 'COMPETITION'); setPage(1) }}>Competition</button>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title">Season</div>
                <div className="segmented-control">
                  {['Summer', 'Fall', 'Spring'].map((season) => (
                    <button key={season} className={`segmented-btn ${seasonFilter === season ? 'active shadow-sm' : ''}`} style={{ background: seasonFilter === season ? 'white' : 'transparent', borderColor: seasonFilter === season ? 'var(--border)' : 'transparent' }} onClick={() => { setSeasonFilter((prev) => prev === season ? '' : season); setPage(1) }}>{season}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Current grade<span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', background: 'var(--border-light)', padding: '2px 6px', borderRadius: '4px' }}>Multi-select</span></div>
                <div className="segmented-control" style={{ flexWrap: 'wrap' }}>
                  {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                    <button key={grade} className={`segmented-btn ${gradesFilter.includes(String(grade)) ? 'active shadow-sm' : ''}`} style={{ flexDirection: 'row', flexBasis: 'calc(25% - 8px)', background: gradesFilter.includes(String(grade)) ? 'white' : 'transparent', borderColor: gradesFilter.includes(String(grade)) ? 'var(--border)' : 'transparent' }} onClick={() => { setGradesFilter((prev) => prev.includes(String(grade)) ? prev.filter((value) => value !== String(grade)) : [...prev, String(grade)]); setPage(1) }}>{grade}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div className="filter-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Interests<span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)', background: 'var(--border-light)', padding: '2px 6px', borderRadius: '4px' }}>Multi-select</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  {allInterests.map((interest) => {
                    const selected = interestIds.includes(String(interest.id))
                    return (
                      <button key={interest.id} onClick={() => { setInterestIds((prev) => selected ? prev.filter((id) => id !== String(interest.id)) : [...prev, String(interest.id)]); setPage(1) }} className={`tag ${selected ? 'shadow-sm' : ''}`} style={{ background: selected ? 'var(--primary)' : 'var(--bg-alt)', color: selected ? 'white' : 'var(--text)', border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', fontSize: '12px', padding: '4px 10px', borderRadius: '100px', transition: 'all 0.2s' }}>{interest.name} {selected && '✓'}</button>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                <label className="checkbox-row"><input type="checkbox" checked={isSelective} onChange={(event) => { setIsSelective(event.target.checked); setPage(1) }} /> Highly Selective</label>
                <label className="checkbox-row"><input type="checkbox" checked={internationalFilter} onChange={(event) => { setInternationalFilter(event.target.checked); setPage(1) }} /> Allows International Students</label>
                <label className="checkbox-row"><input type="checkbox" checked={creditFilter} onChange={(event) => { setCreditFilter(event.target.checked); setPage(1) }} /> Offers College Credit</label>
              </div>
            </details>
          </div>

          <div style={{ flex: '1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>{hasLoadedPrograms ? 'Results' : 'Loading programs...'}</h2>
              <button className="mobile-filter-toggle btn-outline" onClick={() => setIsMobileFilterOpen(true)}>Filters</button>
              {isGuestSearchLocked && !isProgramsLoading && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: '999px', background: 'var(--border-light)' }}>
                  Showing first {resultsMeta.guestVisibleLimit || 10} activities
                </div>
              )}
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }} ref={sortRef}>
                <span>Sort by:</span>
                <button onClick={() => setSortOpen((prev) => !prev)} style={{ border: 'none', background: 'transparent', fontWeight: 'bold', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>{sortBy} <ChevronDown size={14} /></button>
                {sortOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '4px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: '50', minWidth: '140px', overflow: 'hidden', animation: 'fadeIn 0.2s ease' }}>
                    {SORT_OPTIONS.map((option) => (
                      <button key={option} onClick={() => { setSortBy(option); setSortOpen(false); setPage(1) }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: sortBy === option ? 'var(--border-light)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: sortBy === option ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: sortBy === option ? '600' : '500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{option}{sortBy === option && <Check size={14} color="var(--primary)" />}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isProgramsLoading && <div style={{ marginBottom: '18px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Refreshing results...</div>}

            {!hasLoadedPrograms && isProgramsLoading ? (
              <div className="l1-grid">{Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} accentClass={index % 2 === 0 ? 'accent-top' : 'primary-top'} />)}</div>
            ) : (
              <div className="l1-grid">
                {programs.map(renderProgramCard)}
              </div>
            )}

            {hasLoadedPrograms && !isProgramsLoading && programs.length === 0 && (
              <div className="card" style={{ marginTop: '20px', textAlign: 'center', padding: '40px 24px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>No matching programs</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Try widening your filters or clearing a few selections.</p>
              </div>
            )}

            {isGuestSearchLocked && hiddenGuestResultCount > 0 && (
              <LockedSearchPanel hiddenCount={hiddenGuestResultCount} onRegister={handleRegisterForSearchAccess} previewPrograms={programs.slice(-2)} />
            )}

            {!isGuestSearchLocked && (
            <div className="pagination" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '30px' }}>
              <button onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))} disabled={page === 1} className="btn-outline" style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>← Previous</button>
              <div className="pagination-pages">
                {visiblePageItems.map((item) => typeof item === 'number' ? (
                  <button key={item} onClick={() => setPage(item)} className={page === item ? 'btn' : 'btn-outline'} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>{item}</button>
                ) : (
                  <span key={item} className="pagination-ellipsis">...</span>
                ))}
              </div>
              <button onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))} disabled={page >= totalPages} className="btn-outline" style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Next →</button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
