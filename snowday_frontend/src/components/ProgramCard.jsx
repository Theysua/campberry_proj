import { ArrowRightLeft, Calendar, MapPin, Monitor, Plus, Share } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from './Badge'
import Pill from './Pill'

export default function ProgramCard({ program }) {
  // Support both legacy mock data and new scraped data
  const { trpcData } = program
  
  const title = program.title || trpcData?.name || "Untitled Program"
  const org = program.org || trpcData?.provider?.name || "Unknown Organization"
  const logo = program.logo || trpcData?.logo?.url
  const score = program.score || "1.00"
  
  // Mapping recommended badge
  let recommended = program.recommended
  if (!recommended && trpcData?.expertsChoiceRating) {
    recommended = trpcData.expertsChoiceRating.split('_')[0] // MOST, HIGHLY, etc.
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

  // Deadline
  let deadline = program.deadline
  if (!deadline && trpcData?.deadlines?.[0]) {
     const d = new Date(trpcData.deadlines[0].date)
     deadline = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const id = program.id

  return (
    <div className="card flex gap-4 hover:-translate-y-1 group">
      <div className="icon-box sq lg shadow-sm overflow-hidden bg-white shrink-0 border border-slate-100 flex items-center justify-center p-2">
         {logo ? (
           <img src={logo} alt={org} className="w-full h-full object-contain" />
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
          <div className="flex items-center gap-1.5 text-[#ff751f] font-bold md:col-span-2">
            <Monitor size={12} className="currentColor" />
            Waitlist Deadline: {deadline || 'on Feb 1'}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-3 shrink-0 ml-2">
        <button className="text-slate-400 hover:text-[#892233] hover:bg-[#ddfff7] p-1.5 rounded-full transition-colors" title="Share">
          <Share size={16} />
        </button>
        <button className="text-slate-400 hover:text-[#892233] hover:bg-[#ddfff7] p-1.5 rounded-full transition-colors" title="Compare">
          <ArrowRightLeft size={16} />
        </button>
        <button className="text-slate-400 hover:text-[#892233] hover:bg-[#ddfff7] p-1.5 rounded-full transition-colors" title="Add to List">
          <Plus size={16} />
        </button>
        
        {recommended && (
          <div className="mt-auto flex flex-col items-center gap-2">
            <Badge type={recommended} />
            <Badge type="IMPACT_HIGHLY" />
            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#ff751f] transition-colors uppercase tracking-wider">
              <span className="text-sm">☆</span> Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
