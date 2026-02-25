import { ArrowLeft, Check, ChevronDown, Link as LinkIcon, Loader2, MapPin, Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Pill from '../components/Pill'
import ProgramCard from '../components/ProgramCard'
import { getPrograms } from '../services/api'

const RESULTS_PER_PAGE = 10
const SORT_OPTIONS = ['Relevancy', 'Deadline (Soonest)', 'Selectivity', 'A–Z']
const INTEREST_TAGS = ['Summer', 'STEM', 'Business', 'Humanities', 'Research', 'Hong Kong']

export default function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [programsData, setProgramsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await getPrograms('?limit=1000') // fetch all for local filtering
        const dbPrograms = response.data.map(p => ({
          ...p,
          trpcData: {
            ...p,
            name: p.name,
            provider: p.provider,
            interests: p.interests?.map(i => i.interest) || [],
            isHighlySelective: p.is_highly_selective,
            expertsChoiceRating: p.experts_choice_rating,
            onlyUsCitizens: p.only_us_citizens,
            onlyUsResidents: p.only_us_residents,
            eligibleGrades: p.eligible_grades,
            sessions: p.sessions,
            deadlines: p.deadlines,
            logo: { url: p.logo_url }
          }
        }))
        setProgramsData(dbPrograms)
      } catch (err) {
        console.error("Failed to load programs:", err)
      } finally {
        setLoading(false)
      }
    }
    loadPrograms()
  }, [])

  // --- State (synced to URL params) ---
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isInternational, setIsInternational] = useState(searchParams.get('intl') === 'true')
  const [isUsOnly, setIsUsOnly] = useState(searchParams.get('us') === 'true')
  const [locationName, setLocationName] = useState(searchParams.get('loc') || '')
  const [expertFilter, setExpertFilter] = useState(searchParams.get('expert') || '') // MOST, HIGHLY, or ''
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '') // Program, Competition, or ''
  const [seasonFilter, setSeasonFilter] = useState(searchParams.get('season') || '') // Summer, Fall, Spring
  const [gradeFilter, setGradeFilter] = useState(searchParams.get('grade') || '')
  const [interestTags, setInterestTags] = useState(
    searchParams.get('tags') ? searchParams.get('tags').split(',') : []
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Relevancy')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))

  // --- UI state ---
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [sharePopover, setSharePopover] = useState(null) // null | 'copied'
  const [interestInput, setInterestInput] = useState('')
  const sortRef = useRef(null)

  // --- Sync all filters to URL ---
  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (isInternational) params.intl = 'true'
    if (isUsOnly) params.us = 'true'
    if (locationName) params.loc = locationName
    if (expertFilter) params.expert = expertFilter
    if (typeFilter) params.type = typeFilter
    if (seasonFilter) params.season = seasonFilter
    if (gradeFilter) params.grade = gradeFilter
    if (interestTags.length) params.tags = interestTags.join(',')
    if (sortBy !== 'Relevancy') params.sort = sortBy
    if (page > 1) params.page = String(page)
    setSearchParams(params, { replace: true })
  }, [query, isInternational, isUsOnly, locationName, expertFilter, typeFilter, seasonFilter, gradeFilter, interestTags, sortBy, page, setSearchParams])

  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortMenu(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => setLocationName('Current Location'))
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setSharePopover('copied')
      setTimeout(() => setSharePopover(null), 2000)
    })
  }

  const handleReset = () => {
    setIsInternational(false); setIsUsOnly(false); setLocationName('')
    setExpertFilter(''); setTypeFilter(''); setSeasonFilter('')
    setGradeFilter(''); setInterestTags([]); setQuery(''); setPage(1)
  }

  const addInterestTag = (tag) => {
    if (!interestTags.includes(tag)) setInterestTags(prev => [...prev, tag])
  }
  const removeInterestTag = (tag) => setInterestTags(prev => prev.filter(t => t !== tag))

  const handleInterestInput = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      addInterestTag(interestInput.trim())
      setInterestInput('')
    }
  }

  // Calculate active filter count
  const activeFilterCount = [
    isInternational, isUsOnly, !!locationName, !!expertFilter,
    !!typeFilter, !!seasonFilter, !!gradeFilter, interestTags.length > 0
  ].filter(Boolean).length

  // --- Filtering ---
  const filteredResults = useMemo(() => {
    let results = programsData.filter(prog => {
      const opp = prog.trpcData || {}

      // Eligibility
      if (isInternational && opp.onlyUsCitizens !== false) return false
      if (isUsOnly && opp.onlyUsCitizens !== true && opp.onlyUsResidents !== true) return false

      // Query
      if (query) {
        const q = query.toLowerCase()
        const nameMatch = (opp.name || prog.title || '').toLowerCase().includes(q)
        const orgMatch = (opp.provider?.name || prog.org || '').toLowerCase().includes(q)
        const tagMatch = (opp.interests || []).some(i => i.name.toLowerCase().includes(q))
        if (!nameMatch && !orgMatch && !tagMatch) return false
      }

      // Expert filter
      if (expertFilter) {
        const rating = opp.expertsChoiceRating || ''
        if (!rating.startsWith(expertFilter)) return false
      }

      // Type filter
      if (typeFilter) {
        const t = (opp.type || '').toLowerCase()
        if (!t.includes(typeFilter.toLowerCase())) return false
      }

      // Season filter
      if (seasonFilter && opp.sessions?.[0]?.startDate) {
        const month = new Date(opp.sessions[0].startDate).getMonth()
        const isSummer = month >= 5 && month <= 8
        const isFall = month >= 8 && month <= 11
        const isSpring = month >= 2 && month <= 5
        if (seasonFilter === 'Summer' && !isSummer) return false
        if (seasonFilter === 'Fall' && !isFall) return false
        if (seasonFilter === 'Spring' && !isSpring) return false
      }

      // Grade filter
      if (gradeFilter && opp.eligibleGrades?.length) {
        if (!opp.eligibleGrades.includes(gradeFilter)) return false
      }

      // Interest tags
      if (interestTags.length) {
        const progTags = (opp.interests || []).map(i => i.name.toLowerCase())
        const hasMatch = interestTags.some(tag => progTags.includes(tag.toLowerCase()))
        if (!hasMatch) return false
      }

      return true
    })

    // Sort
    if (sortBy === 'A–Z') {
      results = results.sort((a, b) => (a.title || a.trpcData?.name || '').localeCompare(b.title || b.trpcData?.name || ''))
    } else if (sortBy === 'Deadline (Soonest)') {
      results = results.sort((a, b) => {
        const da = a.trpcData?.deadlines?.[0]?.date || '9999'
        const db = b.trpcData?.deadlines?.[0]?.date || '9999'
        return new Date(da) - new Date(db)
      })
    } else if (sortBy === 'Selectivity') {
      results = results.sort((a, b) => {
        const ra = a.trpcData?.expertsChoiceRating || ''
        const rb = b.trpcData?.expertsChoiceRating || ''
        return rb.localeCompare(ra)
      })
    }

    return results
  }, [isInternational, isUsOnly, query, expertFilter, typeFilter, seasonFilter, gradeFilter, interestTags, sortBy, programsData])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE))
  const pagedResults = filteredResults.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE)

  const goToPage = (p) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleButton = (val, current, setter) => setter(current === val ? '' : val)

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 relative z-30 py-4 shadow-sm">
        <div className="container flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="p-3 bg-slate-100 hover:bg-[#ddfff7] rounded-lg text-[#892233] transition-colors font-bold">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 flex shadow-sm rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#892233] focus-within:ring-1 focus-within:ring-[#892233] transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search by name, subject, organization..."
              className="flex-1 px-4 py-3 outline-none text-[#011936] font-medium"
            />
            <button className="bg-[#892233] hover:bg-[#780000] text-white px-6 font-bold transition-colors flex items-center justify-center">
              <SearchIcon size={18} />
            </button>
          </div>
          {/* Share button with popover */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-3 bg-slate-100 hover:bg-[#ddfff7] rounded-lg text-[#892233] transition-colors font-bold flex items-center gap-1 text-xs"
              title="Copy link to current search"
            >
              <LinkIcon size={16} />
            </button>
            {sharePopover === 'copied' && (
              <div className="absolute top-12 right-0 bg-[#011936] text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-2 z-50 animate-fade-in">
                <Check size={12} className="text-[#ddfff7]" /> Link copied!
                <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#011936] rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explicit Spacer for guaranteed gap */}
      <div className="h-8 md:h-10 w-full shrink-0"></div>

      <div className="container flex flex-col md:flex-row gap-8 items-start">

        {/* LEFT: Filter Panel */}
        <div className="w-full md:w-[280px] shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="font-bold flex items-center gap-2 text-[#011936]">
              <SlidersHorizontal size={16} />
              Filters {activeFilterCount > 0 && (
                <span className="bg-[#892233] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </h2>
              {activeFilterCount > 0 && (
                <button className="text-xs font-bold text-[#892233] hover:text-[#780000] flex items-center gap-1 bg-[#ddfff7] px-2 py-1 rounded-md transition-colors" onClick={handleReset}>
                  <X size={12} /> Reset
                </button>
              )}
            </div>

            {/* Experts' Choice */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Experts' Choice</div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleButton('MOST', expertFilter, setExpertFilter)}
                  className={`flex-1 py-1.5 border font-bold text-[10px] rounded transition-colors ${expertFilter === 'MOST' ? 'border-[#892233] bg-[#892233] text-white' : 'border-[#892233] bg-white text-[#892233] hover:bg-[#ddfff7]'}`}
                >MOST</button>
                <button
                  onClick={() => toggleButton('HIGHLY', expertFilter, setExpertFilter)}
                  className={`flex-1 py-1.5 border font-bold text-[10px] rounded transition-colors ${expertFilter === 'HIGHLY' ? 'border-[#ff751f] bg-[#ff751f] text-white' : 'border-[#ff751f] bg-white text-[#ff751f] hover:bg-orange-50'}`}
                >HIGHLY</button>
              </div>
            </div>

            {/* Type */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Type</div>
              <div className="flex gap-2">
                {['Program', 'Competition'].map(t => (
                  <button
                    key={t}
                    onClick={() => toggleButton(t, typeFilter, setTypeFilter)}
                    className={`flex-1 py-1.5 border text-xs rounded font-semibold transition-colors ${typeFilter === t ? 'border-[#011936] bg-[#011936] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Location</div>
              <button
                onClick={handleGeolocation}
                className="w-full text-left p-2 border border-slate-200 rounded text-xs text-[#011936] font-medium mb-2 hover:bg-[#ddfff7] flex items-center gap-2 transition-colors"
              >
                <MapPin size={14} className="text-[#892233]" /> {locationName || "Use current location"}
              </button>
              <input
                type="text"
                placeholder="City, State, or Zip"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded text-xs mb-2 outline-none focus:border-[#892233]"
              />
              <div className="flex gap-4 mt-3 text-xs text-[#011936] font-medium">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="accent-[#892233]" defaultChecked /> Include Online
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="accent-[#892233]" /> Online Only
                </label>
              </div>
            </div>

            {/* Season */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Season</div>
              <div className="flex gap-2">
                {[['Summer','⛵'], ['Fall','🍂'], ['Spring','🌸']].map(([s, emoji]) => (
                  <button
                    key={s}
                    onClick={() => toggleButton(s, seasonFilter, setSeasonFilter)}
                    className={`flex-1 py-1.5 border text-xs rounded font-semibold transition-colors flex justify-center items-center gap-1 ${seasonFilter === s ? 'border-[#892233] bg-[#ddfff7] text-[#892233]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >{emoji} {s}</button>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Current Grade</div>
              <div className="flex gap-2">
                {['9', '10', '11', '12'].map(g => (
                  <button
                    key={g}
                    onClick={() => toggleButton(g, gradeFilter, setGradeFilter)}
                    className={`flex-1 py-1.5 border font-semibold text-xs rounded transition-colors ${gradeFilter === g ? 'border-[#892233] bg-[#892233] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}
                  >{g}</button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Interests</div>
              <input
                type="text"
                placeholder="Type and press Enter..."
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                onKeyDown={handleInterestInput}
                className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:border-[#892233] mb-2 font-medium"
              />
              {/* Quick-add chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {INTEREST_TAGS.filter(t => !interestTags.includes(t)).map(tag => (
                  <button
                    key={tag}
                    onClick={() => addInterestTag(tag)}
                    className="text-[10px] font-bold px-2 py-1 border border-slate-200 rounded-full text-slate-500 hover:border-[#892233] hover:text-[#892233] transition-colors"
                  >+ {tag}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {interestTags.map(tag => (
                  <Pill key={tag} text={tag} onRemove={() => removeInterestTag(tag)} />
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Eligibility</div>
              <div className="space-y-2 mt-2">
                <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${isInternational ? 'border-[#892233] bg-[#ddfff7]' : 'border-slate-200 bg-white'}`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#011936]">Allows International Students</span>
                    <span className="text-[10px] text-[#011936] opacity-60">Non-US citizens / residents</span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#892233]"
                    checked={isInternational}
                    onChange={() => { setIsInternational(!isInternational); if (!isInternational) setIsUsOnly(false); setPage(1) }}
                  />
                </label>
                <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${isUsOnly ? 'border-[#892233] bg-[#ddfff7]' : 'border-slate-200 bg-white'}`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600">US Students Only</span>
                    <span className="text-[10px] text-slate-400">Strictly US citizenship/residence</span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#892233]"
                    checked={isUsOnly}
                    onChange={() => { setIsUsOnly(!isUsOnly); if (!isUsOnly) setIsInternational(false); setPage(1) }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex justify-between items-center hover:bg-slate-50 transition-colors">
              Advanced Criteria <ChevronDown size={14} />
            </button>
            <button className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex justify-between items-center hover:bg-slate-50 transition-colors">
              Only For... <ChevronDown size={14} />
            </button>
            <button className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex justify-between items-center hover:bg-slate-50 transition-colors">
              Filter Out... <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Results Header Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex justify-between items-center flex-wrap gap-4">
            <span className="text-sm font-bold text-[#011936]">
              {filteredResults.length === 0
                ? 'No results'
                : `${(page - 1) * RESULTS_PER_PAGE + 1}–${Math.min(page * RESULTS_PER_PAGE, filteredResults.length)} of ${filteredResults.length} results`}
            </span>
            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-[#011936] flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Sort: <span className="text-[#892233]">{sortBy}</span> <ChevronDown size={14} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] overflow-hidden w-52 animate-fade-in">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSortMenu(false); setPage(1) }}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center justify-between hover:bg-[#ddfff7] transition-colors ${sortBy === opt ? 'text-[#892233]' : 'text-[#011936]'}`}
                    >
                      {opt} {sortBy === opt && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">
              <Loader2 className="animate-spin mx-auto mb-4 text-[#892233]" size={32} />
              <div className="text-lg font-bold text-[#011936] mb-2">Finding programs...</div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-lg font-bold text-[#011936] mb-2">No results found</div>
              <div className="text-sm mb-6">Try adjusting your filters or search query</div>
              <button onClick={handleReset} className="btn sm">Reset All Filters</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pagedResults.map((prog, index) => (
                <div key={prog.id || index}>
                  <ProgramCard program={prog} />
                  {/* CTA banner every 5 cards */}
                  {(index + 1) % 5 === 0 && index < pagedResults.length - 1 && (
                    <div className="bg-[#ddfff7] border border-[#892233]/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[#011936] shadow-sm my-4">
                      <div>
                        <div className="font-bold">Not sure where to start?</div>
                        <div className="text-sm opacity-90">Contact our experts for free, personalized program recommendations.</div>
                      </div>
                      <button className="bg-[#892233] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#780000] transition-colors whitespace-nowrap shadow-md">
                        Ask Campberry
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white text-[#011936] font-bold hover:bg-[#ddfff7] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-colors ${pageNum === page ? 'bg-[#892233] text-white shadow-md' : 'bg-white border border-slate-200 text-[#011936] hover:bg-[#ddfff7]'}`}
                  >{pageNum}</button>
                )
              })}
              {totalPages > 5 && page < totalPages - 2 && <div className="w-10 h-10 flex items-center justify-center text-slate-400">…</div>}
              {totalPages > 5 && page < totalPages - 2 && (
                <button onClick={() => goToPage(totalPages)} className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-bold">{totalPages}</button>
              )}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white text-[#011936] font-bold hover:bg-[#ddfff7] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
