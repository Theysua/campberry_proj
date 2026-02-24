import { ArrowLeft, Share } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import ProgramCard from '../components/ProgramCard'

export default function ListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const program1 = {
    id: "clark-scholars",
    title: "Clark Scholars Program",
    org: "Texas Tech University",
    tags: ["Research", "STEM"],
    dates: "Summer: Jun 17 - Aug 2",
    location: "Lubbock, TX",
    deadline: "passed",
    score: "1.00",
    recommended: "MOST"
  }

  const program2 = {
    id: "wharton-lbw",
    title: "Wharton Pre-Baccalaureate Program",
    org: "University of Pennsylvania",
    tags: ["Business", "Leadership"],
    dates: "Summer: Jul 1 - Aug 10",
    location: "Philadelphia, PA",
    deadline: "in 2 months",
    score: "0.95",
    recommended: "HIGHLY"
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in relative z-0">
      <div className="container max-w-3xl pt-8">
        
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="btn outline sm text-slate-600 border-slate-300 hover:bg-slate-100 bg-white shadow-sm">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex gap-2">
            <button className="btn outline sm text-slate-600 border-slate-300 hover:bg-slate-100 bg-white shadow-sm">
              <Share size={14} /> Share
            </button>
            <button className="btn sm flex items-center gap-1.5 shadow-md">
               Save List
            </button>
          </div>
        </div>

        {/* List Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#011936] leading-tight mb-2">School Counseling Group's Favorite Programs</h1>
          <div className="text-sm text-slate-600 mb-1 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs scale-110">SC</div>
            From <span className="font-semibold text-blue-600 cursor-pointer">School Counseling Group</span>
          </div>
          <div className="text-xs text-slate-400 mb-5">Updated Dec 22, 2025</div>
          
          <a href="#" className="text-sm font-semibold text-blue-600 mb-5 inline-flex hover:underline">🔗 Learn More About the Method</a>
          
          <div className="text-slate-700 leading-relaxed bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-2">
            This curated list represents our top recommendations for highly motivated students aiming for selective universities. We evaluate these based on selectivity, academic rigor, and mentorship quality.
          </div>
        </div>

        <hr className="border-slate-200 my-8" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#011936]">2 Opportunities</h2>
        </div>

        <div className="space-y-8">
          
          {/* Item 1 with Commentary */}
          <div>
            <ProgramCard program={program1} />
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 mt-4 ml-6 shadow-sm relative">
              <div className="absolute -left-3 top-6 w-3 h-[2px] bg-blue-200"></div>
              <div className="absolute -left-[18px] top-0 bottom-6 w-[2px] bg-blue-200"></div>
              
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="text-sm">💬</span> Author's Commentary
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "This is one of the most prestigious research programs for high schoolers. Students work directly with faculty on original research. It is incredibly competitive but entirely free and provides a stipend. Not to be missed if you love STEM."
              </p>
            </div>
          </div>

          {/* Interspersed text paragraph */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-5 shadow-sm text-slate-800 text-[15px] leading-relaxed relative">
            <div className="absolute top-0 right-4 -mt-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">Author Note</div>
            The following programs are part of the Wharton ecosystem. Each offers a different focus area and timeline...
          </div>

          {/* Item 2 with Commentary */}
          <div>
            <ProgramCard program={program2} />
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 mt-4 ml-6 shadow-sm relative">
              <div className="absolute -left-3 top-6 w-3 h-[2px] bg-blue-200"></div>
              <div className="absolute -left-[18px] top-0 bottom-6 w-[2px] bg-blue-200"></div>
              
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="text-sm">💬</span> Author's Commentary
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "An excellent introduction to business and economics for motivated students. Even though it is paid, financial aid is available, making it a great option."
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
