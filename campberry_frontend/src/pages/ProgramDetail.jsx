import { ArrowLeft, Calendar, ChevronDown, ChevronRight, ExternalLink, Globe, GraduationCap, Info, Loader2, MapPin, Share, Sparkles, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Badge from '../components/Badge'
import { getProgramById } from '../services/api'

export default function ProgramDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('sessions')
  const [isCostsOpen, setIsCostsOpen] = useState(false)

  const [programData, setProgramData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const data = await getProgramById(id)
        if (data) {
          const opp = {
            ...data,
            name: data.name,
            provider: data.provider,
            interests: data.interests?.map(i => i.interest) || [],
            isHighlySelective: data.is_highly_selective,
            expertsChoiceRating: data.experts_choice_rating,
            costInfo: data.cost_info,
            admissionInfo: data.admission_info,
            eligibilityInfo: data.eligibility_info,
            eligibleGrades: data.eligible_grades,
            logo: { url: data.logo_url },
            url: data.url
          }
          setProgramData({ title: data.name, org: data.provider?.name, trpcData: opp, description: data.description })
        }
      } catch (err) {
        console.error("Failed to load program detail", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProgram()
  }, [id])

  if (loading) {
    return (
      <div className="bg-[#f4f7f9] min-h-screen pb-20 flex flex-col items-center justify-center p-20 text-center animate-fade-in text-slate-500">
        <Loader2 className="animate-spin text-[#892233] mb-4" size={32} />
        <div className="font-bold text-lg">Loading Program Details...</div>
      </div>
    )
  }

  if (!programData) return <div className="p-20 text-center">Program not found.</div>

  const { title, org, trpcData } = programData
  const opp = trpcData || {}
  
  // Formatters
  const formatDateRange = (start, end) => {
    if (!start) return "Dates TBD";
    const s = new Date(start);
    const e = end ? new Date(end) : null;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!e) return months[s.getMonth()];
    return `${months[s.getMonth()]} - ${months[e.getMonth()]}`;
  }

  const formatDeadline = (deadlines) => {
    if (!deadlines || deadlines.length === 0) return "TBD";
    const d = new Date(deadlines[0].date);
    return `on ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  // Removed getYoutubeEmbed function as it's no longer needed per requirements

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-20 animate-fade-in relative z-0 text-[#011936]">
      <div className="container max-w-4xl pt-8 px-4">
        
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#892233] hover:text-[#780000] font-bold text-sm transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-[#892233] hover:text-[#780000] font-bold text-sm transition-colors" title="Share">
              <Share size={16} /> Share
            </button>
            <button className="flex items-center gap-2 text-[#892233] hover:text-[#780000] font-bold text-sm transition-colors" title="Save">
              <Star size={16} /> Save
            </button>
          </div>
        </div>

        {/* Program Info Header - Replaced Video with prominent Logo/Title section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 mb-8 relative overflow-hidden group">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f8fafc]/20 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
            {/* Prominent Logo Block */}
            <div className="w-40 h-40 bg-white rounded-2xl p-4 flex items-center justify-center shrink-0 shadow-md border border-slate-100 transition-transform hover:scale-105">
               {opp.logo?.url ? (
                 <img src={opp.logo.url} alt={org} className="w-full h-full object-contain" />
               ) : (
                 <span className="font-serif font-black text-[#892233] text-5xl leading-none text-center uppercase">
                   {org?.substring(0,3) || 'EDU'}
                 </span>
               )}
            </div>
            
            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#011936] leading-tight mb-2 tracking-tight">{opp.name || title}</h1>
                  <div className="text-xl text-[#892233] font-bold">{opp.provider?.name || org}</div>
                </div>
                
                {/* Recommended Badge moved here from the video hero */}
                {opp.expertsChoiceRating && (
                  <div className="w-24 h-24 bg-[#ff751f] rounded-full flex flex-col items-center justify-center text-white font-serif border-[3px] border-dashed border-white shadow-xl rotate-[10deg] hover:rotate-0 transition-transform cursor-pointer shrink-0">
                    <div className="text-xl leading-none">⭐</div>
                    <div className="font-bold text-lg leading-tight mt-1 text-center px-2 uppercase tracking-tighter">
                       {opp.expertsChoiceRating.split('_')[0]}
                    </div>
                    <div className="text-[10px] font-semibold tracking-wide uppercase">RECOMMENDED</div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                {(opp.interests || []).slice(0, 5).map((t, i) => (
                  <span key={i} className="px-4 py-1.5 bg-[#f8fafc] rounded-full text-sm font-bold border border-[#011936]/10 text-[#011936]">{t.name}</span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-[#011936] font-medium">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <GraduationCap size={20} className="text-[#892233]" /> {opp.type || 'Program'}
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Calendar size={20} className="text-[#892233]" /> 
                  {opp.sessions?.[0] ? formatDateRange(opp.sessions[0].startDate, opp.sessions[0].endDate) : 'Dates TBD'}
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <MapPin size={20} className="text-[#892233]" /> 
                  {opp.sessions?.[0]?.location?.name || 'Various Locations'}
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <ClockIcon size={20} className="text-[#892233]" /> 
                  <span className="italic">Deadline:</span> {formatDeadline(opp.deadlines)} <span className="text-[#ff751f]">✨</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start sm:col-span-2">
                  <button 
                    onClick={() => setIsCostsOpen(true)}
                    className="flex items-center gap-2 text-[#892233] hover:text-[#780000] font-bold transition-colors"
                  >
                    <Info size={20} /> View Costs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* About */}
          <section className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-[#011936] mb-6">About</h2>
            <div className="text-slate-700 leading-relaxed text-[16px] space-y-4 whitespace-pre-wrap">
              {(programData.description || opp.description || "").split('\n').map((para, i) => para.trim() ? <p key={i}>{para}</p> : null)}
            </div>
          </section>

          {/* Expert Guidance / Additional Info */}
          {opp.additionalInfo && (
            <section className="p-8 border-b border-slate-100 bg-[#f8fafc]/30">
              <h2 className="text-xl font-bold text-[#011936] mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-[#ff751f]" /> Expert Guidance
              </h2>
              <div className="text-slate-700 leading-relaxed text-[15px] space-y-4 whitespace-pre-wrap italic">
                {opp.additionalInfo.split('\n\n').map((para, i) => para.trim() ? <p key={i}>{para}</p> : null)}
              </div>
            </section>
          )}

          {/* External Reviews / Insights */}
          {opp.externalReviews && opp.externalReviews.length > 0 && (
            <section className="p-8 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-bold text-[#011936] mb-6 flex items-center gap-2">
                <Globe size={20} className="text-[#892233]" /> External Reviews & Insights
              </h2>
              <div className="space-y-6">
                {opp.externalReviews.map((review, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-[#011936] text-lg">{review.title}</h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{review.authorDescription}</span>
                    </div>
                    <p className="text-slate-600 text-[15px] leading-relaxed italic mb-4">
                      "{review.content}"
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#892233]">— {review.authorName}</span>
                      {review.url && (
                        <a href={review.url} target="_blank" rel="noopener noreferrer" className="text-[#ff751f] font-bold hover:underline flex items-center gap-1">
                          Source <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Accordions */}
          <div className="p-4 px-8">
            {/* Sessions */}
            <div className="py-4 border-b border-slate-100 cursor-pointer group" onClick={() => setActiveTab(activeTab === 'sessions' ? '' : 'sessions')}>
              <div className="flex justify-between items-center text-lg font-bold text-[#011936] group-hover:text-[#892233] transition-colors">
                <span>Sessions</span>
                {activeTab === 'sessions' ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </div>
              {activeTab === 'sessions' && (
                <div className="mt-4 text-slate-700 space-y-3 text-[15px]">
                  {opp.sessions?.length > 0 ? opp.sessions.map((s, idx) => (
                    <div key={idx} className="pb-3 last:border-0 border-b border-slate-50">
                      <div className="flex justify-between font-medium">
                        <span>{s.location?.name || 'Online'}</span>
                        <span>{formatDateRange(s.startDate, s.endDate)}</span>
                      </div>
                    </div>
                  )) : <p className="text-slate-500">No session data available.</p>}
                </div>
              )}
            </div>
            
            {/* Applications */}
            <div className="py-4 border-b border-slate-100 cursor-pointer group" onClick={() => setActiveTab(activeTab === 'applications' ? '' : 'applications')}>
              <div className="flex justify-between items-center text-lg font-bold text-[#011936] group-hover:text-[#892233] transition-colors">
                <span>Applications</span>
                {activeTab === 'applications' ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </div>
              {activeTab === 'applications' && (
                <div className="mt-4 text-slate-700 space-y-4 text-[15px]">
                  <div>
                    <strong className="block text-[#011936]">Admission Info</strong>
                    <p className="whitespace-pre-wrap">{opp.admissionInfo || "See website for details."}</p>
                  </div>
                  {opp.deadlines?.map((d, i) => (
                    <div key={i}>
                      <strong className="block text-[#011936]">{d.description || 'Deadline'}</strong>
                      {new Date(d.date).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Eligibility */}
            <div className="py-4 cursor-pointer group" onClick={() => setActiveTab(activeTab === 'eligibility' ? '' : 'eligibility')}>
              <div className="flex justify-between items-center text-lg font-bold text-[#011936] group-hover:text-[#892233] transition-colors">
                <span>Eligibility</span>
                {activeTab === 'eligibility' ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </div>
              {activeTab === 'eligibility' && (
                <div className="mt-4 text-slate-700 space-y-4 text-[15px]">
                   <p className="whitespace-pre-wrap">{opp.eligibilityInfo || "See website for details."}</p>
                   {opp.eligibleGrades && (
                     <div>
                        <strong className="block text-[#011936]">Eligible Grades</strong>
                        {opp.eligibleGrades.join(', ')}
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a href={opp.url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 btn bg-[#892233] hover:bg-[#780000] text-white font-bold py-4 rounded-xl text-lg shadow-sm flex items-center justify-center gap-2 decoration-0 no-underline">
            Apply Here <ExternalLink size={20} />
          </a>
          <a href={opp.url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 btn outline sm bg-white border-[#892233] text-[#892233] hover:bg-[#f8fafc] font-bold py-4 rounded-xl text-lg shadow-sm flex items-center justify-center gap-2 decoration-0 no-underline">
            <Globe size={20} /> View Website
          </a>
        </div>

        {/* Ratings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-12 relative overflow-hidden">
          <h2 className="text-2xl font-bold text-[#011936] mb-8">Ratings</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-6">
              <div className="text-lg font-bold text-[#011936]">Highly Selective</div>
              <div className="flex items-center gap-2 text-lg font-bold text-[#892233]">
                <Star size={20} className={opp.isHighlySelective ? "fill-[#892233]" : ""} /> 
                {opp.isHighlySelective ? "Yes" : "No"}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="text-lg font-bold text-[#011936]">Impact on Admissions</div>
              <div className="flex items-center gap-2 text-lg font-bold text-[#892233]">
                <Badge type="IMPACT_HIGHLY" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact CTA */}
        <div className="bg-[#f8fafc] rounded-xl p-12 text-center mb-12 border border-[#892233]/10">
          <h2 className="text-2xl font-bold text-[#011936] mb-2 leading-tight">Contact Our Experts<br/>For Free Program<br/>Recommendations</h2>
          <button className="mt-6 btn bg-[#892233] hover:bg-[#780000] text-white font-bold py-3 px-8 rounded-full shadow-sm">
            <span className="flex items-center gap-2">
              <span className="bg-[#780000] w-5 h-5 rounded-full flex items-center justify-center text-xs">?</span> Ask Campberry
            </span>
          </button>
        </div>

      </div>

      {/* Costs Modal */}
      {isCostsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fbfcff] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-200">
            <button 
              onClick={() => setIsCostsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={24} />
            </button>
            
            <div className="p-12 text-center">
              <h2 className="text-2xl font-bold text-[#011936] mb-6">Costs</h2>
              <div className="text-slate-700 leading-relaxed text-[17px] whitespace-pre-wrap">
                {opp.costInfo || "Please visit the program website for detailed cost and financial aid information."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function X(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

