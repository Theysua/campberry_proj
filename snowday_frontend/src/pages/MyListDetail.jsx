import { ArrowLeft, ArrowUpDown, BadgeDollarSign, Calendar, Clock, Edit3, GraduationCap, MapPin, MoreVertical, Plus, Search, Share, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function MyListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hasOpportunities, setHasOpportunities] = useState(false) // Toggle state

  // Placeholder for the list details
  const listDetails = {
    title: '123',
    description: '213',
    author: '十大2',
    updated: 'Feb 23'
  }

  // Mock search results for 'stan'
  const searchResults = [
    { id: '1', title: 'Stanford Physics Internship: Women and Individualized Projects (SPINWIP)', org: 'Stanford University' },
    { id: '2', title: 'StandOut Connect', org: 'StandOut Connect' },
    { id: '3', title: 'Stanford Young Investigators', org: 'Stanford Doerr School of Sustainability' },
    { id: '4', title: 'Stanford Medical Youth Science Program', org: 'Stanford Medicine' },
    { id: '5', title: 'Stanford Pre-Collegiate Studies', org: 'Stanford University' },
  ]

  const handleAddOpportunity = () => {
    setHasOpportunities(true)
    setIsModalOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-20 animate-fade-in relative z-0">
      <div className="container max-w-6xl pt-8 px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: List Info */}
          <div className="lg:col-span-4">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <button onClick={() => navigate('/my-lists')} className="flex items-center gap-2 text-[#892233] hover:text-[#780000] font-bold text-sm transition-colors">
                <ArrowLeft size={16} /> My Lists
              </button>
              
              <div className="flex items-center gap-4 text-[#892233]">
                <button className="hover:text-[#780000] transition-colors" title="Share">
                  <Share size={16} />
                </button>
                <button className="hover:text-[#780000] transition-colors" title="Edit">
                  <Edit3 size={16} />
                </button>
              </div>
            </div>

            {/* List Header Info */}
            <div>
              <h1 className="text-3xl font-bold text-[#011936] leading-tight mb-2">{listDetails.title}</h1>
              <div className="text-sm text-slate-500 mb-4">
                From {listDetails.author} • Updated {listDetails.updated}
              </div>
              <div className="text-slate-700 whitespace-pre-line text-[15px]">
                {listDetails.description}
              </div>
            </div>
          </div>

          {/* Right Column: Opportunities or Empty State */}
          <div className="lg:col-span-8">
            
            {!hasOpportunities ? (
              <div className="bg-[#fbfcff] border border-slate-200 rounded-xl py-24 px-8 text-center shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="text-[#892233] mb-4">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-xl font-bold text-[#011936] mb-3">No opportunities yet</h2>
                <p className="text-slate-600 mb-6 max-w-xs mx-auto">
                  Add learning opportunities from our database or write in your own.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn outline sm text-[#892233] border-[#892233]/20 hover:bg-[#ddfff7] rounded-full font-bold px-6"
                >
                  <Plus size={16} /> New Opportunity
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4 font-bold text-sm">
                  <button className="flex items-center gap-2 text-[#892233] hover:text-[#780000]">
                    <ArrowUpDown size={16} /> Reorder
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-[#892233] hover:text-[#780000]"
                  >
                    <Plus size={16} /> New Opportunity
                  </button>
                </div>

                {/* Horizontal Opportunity Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex gap-6 relative group">
                  
                  {/* Logo block */}
                  <div className="w-24 h-24 bg-[#8C1515] rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white font-serif text-5xl">S</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="pr-20 mb-3">
                      <h3 className="text-lg font-bold text-[#011936] leading-tight mb-1 hover:text-[#892233] cursor-pointer">
                        Stanford Physics Internship: Women and Individualized Projects (SPINWIP)
                      </h3>
                      <div className="text-slate-600 text-sm">Stanford University</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-[#ddfff7] text-[#011936] rounded-full text-xs font-bold border border-[#011936]/10">Research</span>
                      <span className="px-3 py-1 bg-[#ddfff7] text-[#011936] rounded-full text-xs font-bold border border-[#011936]/10">STEM</span>
                      <span className="px-3 py-1 bg-[#ddfff7] text-[#011936] rounded-full text-xs font-bold border border-[#011936]/10">Coding</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-sm text-[#011936] font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#892233]/40" /> 
                        <span>Summer: Jul 7 - Jul 25 <span className="text-[#ff751f]">✨</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#892233]/40" /> Online
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#892233]/40" /> 
                        <span className="italic">Deadline:</span> on May 1 <span className="text-[#ff751f]">✨</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Right Badges */}
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <GraduationCap size={18} className="text-[#011936]" />
                    <BadgeDollarSign size={18} className="text-[#011936]" />
                    <div className="w-10 h-10 bg-[#ff751f] rounded-full flex items-center justify-center border-2 border-white text-white shadow-md ml-1" title="Highly Recommended">
                      <Sparkles size={18} />
                    </div>
                  </div>

                  {/* Bottom Right Menu */}
                  <div className="absolute bottom-6 right-6">
                    <button className="text-[#892233] hover:text-[#780000] p-1">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>

      {/* Add Opportunity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[80vh]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 pb-4 shrink-0 border-b border-transparent">
              <h2 className="text-xl font-bold text-[#011936] mb-6">Add Opportunity to List</h2>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-[#011936]" />
                </div>
                <input 
                  type="text" 
                  className="w-full border-2 border-[#892233] rounded-lg pl-10 pr-4 py-2.5 outline-none text-sm text-[#011936] font-bold"
                  placeholder="Search for an opportunity"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results Dropdown Simulation */}
            {searchQuery.length > 0 && (
              <div className="overflow-y-auto px-8 pb-8">
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="flex gap-4 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors border-b border-slate-100 last:border-0"
                      onClick={handleAddOpportunity}
                    >
                      <div className="w-10 h-10 bg-[#8C1515] rounded text-white flex items-center justify-center shrink-0 font-serif text-2xl overflow-hidden relative">
                        {/* Mock logo rendering */}
                        <div className="absolute text-[8px] leading-tight text-center font-sans tracking-tighter opacity-80">
                           {result.org.substring(0,6)}...
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#011936] leading-snug mb-0.5">{result.title}</div>
                        <div className="text-xs text-slate-500">{result.org}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
