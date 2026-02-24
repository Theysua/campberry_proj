import { ArrowLeft, ChevronDown, MapPin, Search as SearchIcon, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Pill from '../components/Pill'
import ProgramCard from '../components/ProgramCard'

import programsData from '../data/detailed_programs.json'

export default function Search() {
  const navigate = useNavigate()
  
  // Use scrapped data for search results
  const results = programsData

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-[68px] z-40 py-4 shadow-sm">
        <div className="container flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="p-3 bg-slate-100 hover:bg-[#ddfff7] rounded-lg text-[#892233] transition-colors font-bold">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 flex shadow-sm rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#892233] focus-within:ring-1 focus-within:ring-[#892233] transition-all">
            <input 
              type="text" 
              defaultValue="Research programs"
              className="flex-1 px-4 py-3 outline-none text-[#011936] font-medium"
            />
            <button className="bg-[#892233] hover:bg-[#780000] text-white px-6 font-bold transition-colors flex items-center justify-center">
              <SearchIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-8 flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT: Filter Panel */}
        <div className="w-full md:w-[280px] shrink-0 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold flex items-center gap-2 text-[#011936]"><SlidersHorizontal size={16}/> Filters (3)</h2>
            <button className="text-xs font-bold text-[#892233] hover:text-[#780000]">Reset Filters</button>
          </div>

          <div className="card p-4 space-y-4 shadow-sm border-slate-200">
            {/* Experts' Choice */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Experts' Choice</div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 border border-[#892233] bg-[#ddfff7] text-[#892233] font-bold text-[10px] rounded hover:bg-[#892233] hover:text-white transition-colors">MOST</button>
                <button className="flex-1 py-1.5 border border-slate-200 bg-white text-slate-600 font-bold text-[10px] rounded hover:border-[#892233] transition-colors">HIGHLY</button>
              </div>
            </div>

            {/* Type */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Type</div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 border border-slate-200 bg-white text-slate-600 text-xs rounded hover:border-slate-300">Program</button>
                <button className="flex-1 py-1.5 border border-slate-200 bg-white text-slate-600 text-xs rounded hover:border-slate-300">Competition</button>
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Location</div>
              <button className="w-full text-left p-2 border border-slate-200 rounded text-xs text-[#011936] font-medium mb-2 hover:bg-[#ddfff7] flex items-center gap-2">
                <MapPin size={14} className="text-[#892233]" /> Use current location
              </button>
              <input type="text" placeholder="City, State, or Zip" className="w-full p-2 border border-slate-200 rounded text-xs mb-2 outline-none focus:border-[#892233]" />
              <button className="w-full text-left p-2 border border-slate-200 rounded text-xs text-slate-600 flex justify-between items-center">
                Radius: 50 miles <ChevronDown size={14} />
              </button>
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
                <button className="flex-1 py-1.5 border border-slate-200 bg-white text-slate-600 text-xs rounded hover:border-slate-300 flex justify-center items-center gap-1">⛵ Summer</button>
                <button className="flex-1 py-1.5 border border-slate-200 bg-white text-slate-600 text-xs rounded hover:border-slate-300 flex justify-center items-center gap-1">🍂 Fall</button>
                <button className="flex-1 py-1.5 border border-slate-200 bg-white text-slate-600 text-xs rounded hover:border-slate-300 flex justify-center items-center gap-1">🌸 Spring</button>
              </div>
            </div>

            {/* Grade */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Current Grade</div>
              <div className="flex gap-2">
                {['9', '10', '11', '12'].map(g => (
                  <button key={g} className="flex-1 py-1.5 border border-slate-200 bg-white font-semibold text-slate-600 text-xs rounded hover:border-slate-300">{g}</button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Interests</div>
              <input type="text" placeholder="Add more interests..." className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:border-[#892233] mb-2 font-medium" />
              <div className="flex flex-wrap gap-2">
                <Pill text="STEM" onRemove={() => {}} />
                <Pill text="Research" onRemove={() => {}} />
              </div>
            </div>

            {/* Financial */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Financial Accessibility</div>
              <div className="space-y-2 text-xs text-[#011936] font-medium">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#892233]"/> A+ — Free + stipend</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#892233]"/> A — Free</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#892233]"/> A- — Very low cost</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#892233]"/> B+ — Low cost with aid</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#892233]"/> B- — Average cost</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#892233]"/> C+ — High cost</label>
              </div>
              <div className="flex gap-4 mt-3">
                <button className="text-[10px] font-bold text-[#892233] hover:underline uppercase">Select All</button>
                <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase">Clear All</button>
              </div>
            </div>

          </div>

          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex justify-between items-center hover:bg-slate-50 transition-colors">
              Advanced Criteria <ChevronDown size={14}/>
            </button>
            <button className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex justify-between items-center hover:bg-slate-50 transition-colors">
              Only For... <ChevronDown size={14}/>
            </button>
            <button className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex justify-between items-center hover:bg-slate-50 transition-colors">
              Filter Out... <ChevronDown size={14}/>
            </button>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="flex-1 flex flex-col min-w-0">
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">1-100 of 2,100+ results</span>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50">
              Sort: Relevancy <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
             {results.map((prog, index) => (
                <div key={prog.id || index}>
                  <ProgramCard program={prog} />
                  {index === 2 && (
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

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-10">
            <button className="w-10 h-10 rounded-lg bg-[#892233] text-white font-bold flex items-center justify-center shadow-md">1</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-[#011936] font-bold hover:bg-[#ddfff7] flex items-center justify-center transition-colors">2</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-[#011936] font-bold hover:bg-[#ddfff7] flex items-center justify-center transition-colors">3</button>
            <div className="w-10 h-10 flex items-center justify-center text-slate-400">...</div>
            <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">22</button>
          </div>

        </div>
      </div>
    </div>
  )
}
