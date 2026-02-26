import { ArrowRightLeft, Calendar, Check, Copy, Loader2, MapPin, Monitor, Plus, Share, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addListItem, getMyLists, saveProgram as saveToFavorites } from '../services/api'
import Badge from './Badge'
import Pill from './Pill'

export default function ProgramCard({ program }) {
  const { trpcData } = program
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareRef = useRef(null)

  const [addListOpen, setAddListOpen] = useState(false)
  const [listsData, setListsData] = useState([])
  const [addingToList, setAddingToList] = useState(null)
  const [addedToList, setAddedToList] = useState(null)
  const [loadingLists, setLoadingLists] = useState(false)
  const addListRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (addListRef.current && !addListRef.current.contains(e.target)) {
        setAddListOpen(false)
      }
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const title = program.title || trpcData?.name || "Untitled Program"
  const org = program.org || trpcData?.provider?.name || "Unknown Organization"
  const logo = (typeof program.logo === 'string' ? program.logo : program.logo?.url) || trpcData?.logo?.url
  const score = program.score || "1.00"
  const id = program.id

  // Recommended badge
  let recommended = program.recommended
  if (!recommended && trpcData?.expertsChoiceRating) {
    recommended = trpcData.expertsChoiceRating.split('_')[0]
  }

  // Tags
  const tags = program.tags || trpcData?.interests?.map(i => i.name) || []

  // Dates
  let dates = program.dates
  if (!dates && trpcData?.sessions?.[0]) {
    const s = new Date(trpcData.sessions[0].startDate)
    const e = trpcData.sessions[0].endDate ? new Date(trpcData.sessions[0].endDate) : null
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    dates = `${months[s.getMonth()]}${e ? ' - ' + months[e.getMonth()] : ''}`
  }

  // Location
  const location = program.location || trpcData?.sessions?.[0]?.location?.name || (trpcData?.sessions?.[0]?.locationType === 'ONLINE' ? 'Online' : 'TBD')

  // Deadline + color coding
  let deadline = program.deadline
  let deadlineStatus = 'normal' // 'passed' | 'soon' | 'normal'
  if (!deadline && trpcData?.deadlines?.[0]) {
    const d = new Date(trpcData.deadlines[0].date)
    const now = new Date()
    deadline = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) deadlineStatus = 'passed'
    else if (diffDays <= 30) deadlineStatus = 'soon'
    else deadlineStatus = 'normal'
  } else if (program.deadline === 'passed') {
    deadlineStatus = 'passed'
  }

  const deadlineColors = {
    passed: 'text-slate-400 line-through',
    soon: 'text-[#892233] font-bold animate-pulse',
    normal: 'text-[#ff751f] font-bold',
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/program/${id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => { setCopied(false); setShareOpen(false) }, 2000)
    } catch {
      setShareOpen(false)
    }
  }

  const handleCardClick = (e) => {
    // Prevent navigation if clicking inside an interactive element
    if (e.target.closest('button') || e.target.closest('a')) {
      return
    }
    navigate(`/program/${id}`)
  }

  const handleOpenAddList = async (e) => {
    e.stopPropagation()
    setAddListOpen(!addListOpen)
    if (!addListOpen && listsData.length === 0) {
      setLoadingLists(true)
      try {
        const data = await getMyLists()
        setListsData(data)
      } catch (err) {
        console.error('Failed to load lists', err)
      }
      setLoadingLists(false)
    }
  }

  const handleAddToList = async (e, listId) => {
    e.stopPropagation()
    setAddingToList(listId)
    try {
      await addListItem(listId, id, '')
      setAddedToList(listId)
      setTimeout(() => setAddedToList(null), 2000)
    } catch (err) {
      console.error('Failed to add to list', err)
    }
    setAddingToList(null)
  }

  const handleSaveProgram = async (e) => {
    e.stopPropagation()
    try {
      await saveToFavorites(id)
      // Visual feedback here optionally
    } catch (err) {
      console.error('Failed to save program', err)
    }
  }

  return (
    <div onClick={handleCardClick} className="card flex gap-4 hover:-translate-y-1 group relative cursor-pointer">
      {/* Logo */}
      <div className={`icon-box sq lg shadow-sm overflow-hidden bg-white shrink-0 border border-slate-100 flex items-center justify-center ${logo ? '' : 'p-2'}`}>
        {logo ? (
          <img src={logo} alt={org} className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-slate-300 text-xl text-center leading-none">
            {org?.substring(0, 1)}
          </span>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-[#892233] font-bold mb-1 uppercase tracking-wider">Score: {score}</div>
        <h3 className="text-lg font-bold text-[#011936] group-hover:text-[#892233] transition-colors truncate">
          <Link to={`/program/${id}`}>{title}</Link>
        </h3>
        <div className="text-xs text-slate-500 mb-2 truncate font-medium">{org}</div>

        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((t, i) => <Pill key={i} text={t} />)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-xs text-[#011936] font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar size={12} className="text-[#892233]" />
            <span className="truncate">{dates || 'Summer'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={12} className="text-[#892233]" />
            <span className="truncate">{location}</span>
          </div>
          <div className={`flex items-center gap-1.5 md:col-span-2 ${deadlineColors[deadlineStatus]}`}>
            <Monitor size={12} />
            {deadlineStatus === 'passed'
              ? `Deadline passed (${deadline})`
              : deadlineStatus === 'soon'
                ? `⚡ Deadline soon: ${deadline}`
                : `Deadline: ${deadline || 'TBD'}`}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 shrink-0 ml-2 relative">
        {/* Share with popover */}
        <div className="relative" ref={shareRef}>
          <button
            onClick={() => setShareOpen(!shareOpen)}
            className="text-slate-400 hover:text-[#892233] hover:bg-[#f8fafc] p-1.5 rounded-full transition-colors"
            title="Share"
          >
            <Share size={16} />
          </button>
          {shareOpen && (
            <div className="absolute right-8 top-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 w-52 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#011936]">Share Program</span>
                <button onClick={() => setShareOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>
              </div>
              <button
                onClick={handleShare}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${copied ? 'bg-[#f8fafc] text-[#011936]' : 'bg-[#892233] text-white hover:bg-[#780000]'}`}
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
              </button>
            </div>
          )}
        </div>

        <button className="text-slate-400 hover:text-[#892233] hover:bg-[#f8fafc] p-1.5 rounded-full transition-colors" title="Compare">
          <ArrowRightLeft size={16} />
        </button>
        <div className="relative" ref={addListRef}>
          <button onClick={handleOpenAddList} className="text-slate-400 hover:text-[#892233] hover:bg-[#f8fafc] p-1.5 rounded-full transition-colors" title="Add to List">
            <Plus size={16} />
          </button>

          {addListOpen && (
            <div className="absolute right-8 top-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden w-48 animate-fade-in">
              <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-slate-50">
                <span className="text-xs font-bold text-[#011936]">Save to List</span>
                <button onClick={(e) => { e.stopPropagation(); setAddListOpen(false) }} className="text-slate-400 hover:text-[#892233]">
                  <X size={12} />
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto w-full p-2 space-y-1">
                {loadingLists ? (
                  <div className="py-4 flex justify-center text-[#892233]"><Loader2 className="animate-spin" size={16} /></div>
                ) : listsData.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-500 font-medium">No lists yet.<br /><Link to="/lists" className="text-[#892233] hover:underline hover:text-[#ff751f] ml-1">Create one</Link></div>
                ) : (
                  listsData.map(list => (
                    <button
                      key={list.id}
                      onClick={(e) => handleAddToList(e, list.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#f8fafc] text-[#011936] transition-colors truncate flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{list.title}</span>
                      {addingToList === list.id ? <Loader2 size={12} className="animate-spin text-[#892233]" /> : addedToList === list.id ? <Check size={12} className="text-[#011936]" /> : <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {recommended && (
          <div className="mt-auto flex flex-col items-center gap-2">
            <Badge type={recommended} />
            <Badge type="IMPACT_HIGHLY" />
            <button onClick={handleSaveProgram} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#ff751f] transition-colors uppercase tracking-wider">
              <span className="text-sm">☆</span> Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
