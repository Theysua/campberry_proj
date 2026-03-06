import { ArrowRightLeft, Calendar, Check, Copy, MapPin, Monitor, Plus, Share, Star, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useListContext } from '../context/ListContext'
import AddToListModal from './AddToListModal'
import Badge from './Badge'
import Pill from './Pill'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getExpertsChoiceBadge = (program, trpcData) => {
  const rating = program.experts_choice_rating || trpcData?.expertsChoiceRating
  if (rating === 'MOST_RECOMMENDED') {
    return 'MOST'
  }

  if (rating === 'HIGHLY_RECOMMENDED') {
    return 'HIGHLY'
  }

  return program.recommended || null
}

const getImpactBadge = (program, trpcData) => {
  const rating = program.impact_rating || trpcData?.impactOnAdmissionsRating
  if (rating === 'MOST_HIGH_IMPACT') {
    return 'IMPACT_MOST'
  }

  if (rating === 'HIGH_IMPACT') {
    return 'IMPACT_HIGHLY'
  }

  return null
}

const getDateLabel = (program, sessions) => {
  if (program.dates) {
    return program.dates
  }

  const firstSession = sessions[0]
  if (!firstSession) {
    return null
  }

  const startDate = firstSession.startDate || firstSession.start_date
  const endDate = firstSession.endDate || firstSession.end_date
  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null

  if (!start || Number.isNaN(start.getTime())) {
    return null
  }

  return `${MONTHS[start.getMonth()]}${end && !Number.isNaN(end.getTime()) ? ` - ${MONTHS[end.getMonth()]}` : ''}`
}

const getDeadlineLabel = (program, deadlines) => {
  if (program.deadline === 'passed') {
    return {
      label: 'Deadline passed',
      status: 'passed',
    }
  }

  const validDeadline = deadlines
    .map((entry) => new Date(entry.date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime())[0]

  if (!validDeadline) {
    return {
      label: 'Deadline: TBD',
      status: 'normal',
    }
  }

  const formatted = validDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const diffDays = Math.ceil((validDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      label: `Deadline passed (${formatted})`,
      status: 'passed',
    }
  }

  if (diffDays <= 30) {
    return {
      label: `Deadline soon: ${formatted}`,
      status: 'soon',
    }
  }

  return {
    label: `Deadline: ${formatted}`,
    status: 'normal',
  }
}

export default function ProgramCard({ program }) {
  const { trpcData } = program
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [addListOpen, setAddListOpen] = useState(false)
  const shareRef = useRef(null)

  const { toggleSaveProgram, isProgramSaved, toggleCompare, compareList } = useListContext()
  const navigate = useNavigate()

  const id = program.id
  const title = program.title || program.name || trpcData?.name || 'Untitled Program'
  const org = program.org || program.provider?.name || trpcData?.provider?.name || 'Unknown Organization'
  const logo = (typeof program.logo === 'string' ? program.logo : program.logo?.url) || program.logo_url || trpcData?.logo?.url
  const score = program.score || '1.00'
  const sessions = trpcData?.sessions || program.sessions || []
  const deadlines = trpcData?.deadlines || program.deadlines || []
  const recommendedBadge = getExpertsChoiceBadge(program, trpcData)
  const impactBadge = getImpactBadge(program, trpcData)
  const isSaved = isProgramSaved(id)
  const isComparing = compareList.some((entry) => entry.id === id)

  const tags =
    program.tags ||
    trpcData?.interests?.map((interest) => interest.name || interest.interest?.name).filter(Boolean) ||
    program.interests?.map((interest) => interest.name || interest.interest?.name).filter(Boolean) ||
    []

  const firstSession = sessions[0]
  const firstSessionLocationType = firstSession?.locationType || firstSession?.location_type
  const location =
    program.location ||
    firstSession?.location?.name ||
    firstSession?.location_name ||
    (firstSessionLocationType === 'ONLINE' ? 'Online' : 'TBD')

  const dates = getDateLabel(program, sessions)
  const deadline = getDeadlineLabel(program, deadlines)

  const deadlineColors = {
    passed: 'text-slate-400 line-through',
    soon: 'text-[#892233] font-bold animate-pulse',
    normal: 'text-[#ff751f] font-bold',
  }

  useEffect(() => {
    const handler = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShareOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleShare = async () => {
    const url = new URL(`${import.meta.env.BASE_URL}program/${id}`, window.location.origin).toString()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShareOpen(false)
      }, 2000)
    } catch {
      setShareOpen(false)
    }
  }

  const handleCardClick = (event) => {
    if (event.target.closest('button') || event.target.closest('a')) {
      return
    }

    navigate(`/program/${id}`)
  }

  const handleOpenAddList = (event) => {
    event.stopPropagation()
    setAddListOpen(true)
  }

  const handleSaveProgram = (event) => {
    event.stopPropagation()
    toggleSaveProgram(id)
  }

  const handleCompare = (event) => {
    event.stopPropagation()
    toggleCompare(program)
  }

  return (
    <div onClick={handleCardClick} className="card flex gap-4 hover:-translate-y-1 group relative cursor-pointer">
      <div className={`w-[56px] h-[56px] min-w-[56px] min-h-[56px] shrink-0 rounded-xl shadow-sm overflow-hidden bg-white border border-slate-100 flex items-center justify-center ${logo ? '' : 'p-2'}`}>
        {logo ? (
          <img src={logo} alt={org} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="font-bold text-slate-300 text-xl text-center leading-none">
            {org?.substring(0, 1)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-[#892233] font-bold mb-1 uppercase tracking-wider">Score: {score}</div>
        <h3 className="text-lg font-bold text-[#011936] group-hover:text-[#892233] transition-colors truncate">
          <Link to={`/program/${id}`}>{title}</Link>
        </h3>
        <div className="text-xs text-slate-500 mb-2 truncate font-medium">{org}</div>

        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag, index) => <Pill key={index} text={tag} />)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-xs text-[#011936] font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar size={12} className="text-[#892233]" />
            <span className="truncate">{dates || 'Dates vary'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={12} className="text-[#892233]" />
            <span className="truncate">{location}</span>
          </div>
          <div className={`flex items-center gap-1.5 md:col-span-2 ${deadlineColors[deadline.status]}`}>
            <Monitor size={12} />
            {deadline.label}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 shrink-0 ml-2 relative">
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

        <button
          onClick={handleCompare}
          className={`p-1.5 rounded-full transition-colors ${isComparing ? 'text-[#892233] bg-[#f8fafc]' : 'text-slate-400 hover:text-[#892233] hover:bg-[#f8fafc]'}`}
          title="Compare"
        >
          <ArrowRightLeft size={16} />
        </button>

        <button onClick={handleOpenAddList} className="text-slate-400 hover:text-[#892233] hover:bg-[#f8fafc] p-1.5 rounded-full transition-colors" title="Add to List">
          <Plus size={16} />
        </button>

        <div className="mt-auto flex flex-col items-center gap-2">
          {recommendedBadge && <Badge type={recommendedBadge} />}
          {impactBadge && <Badge type={impactBadge} />}
          <button onClick={handleSaveProgram} className={`flex items-center gap-1 text-[10px] font-bold transition-colors uppercase tracking-wider ${isSaved ? 'text-[#ff751f]' : 'text-slate-500 hover:text-[#ff751f]'}`}>
            <Star size={12} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <AddToListModal isOpen={addListOpen} onClose={() => setAddListOpen(false)} programId={id} />
    </div>
  )
}
