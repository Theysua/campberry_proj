import { ArrowLeft, Edit3, Loader2, MousePointerClick, Plus, Share } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProgramCard from '../components/ProgramCard'
import { getListById } from '../services/api'

export default function MyListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getListById(id)
        
        // Map data to expected ProgramCard format
        if (data.items) {
          data.items = data.items.map(item => ({
            ...item,
            program: {
              ...item.program,
              trpcData: {
                ...item.program,
                logo: { url: item.program.logo_url }
              }
            }
          }))
        }
        
        setList(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load list. It may not exist.')
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [id])

  if (loading) {
    return (
      <div className="bg-[#f4f7f9] min-h-screen py-20 flex justify-center">
        <Loader2 className="animate-spin text-[#892233]" size={32} />
      </div>
    )
  }

  if (error || !list) {
    return (
      <div className="bg-[#f4f7f9] min-h-screen py-20 text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-4">{error || "List not found"}</h2>
        <button onClick={() => navigate('/my-lists')} className="text-[#892233] hover:underline">Go back to My Lists</button>
      </div>
    )
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#011936] leading-tight mb-2 tracking-tight">{list.title}</h1>
              <div className="text-sm font-semibold text-slate-500 mb-1 flex items-center gap-2">
                Created by you
              </div>
              <div className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
                Updated {new Date(list.updated_at).toLocaleDateString()}
              </div>
              
              {list.description ? (
                <div className="text-sm font-medium text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-xl p-5 shadow-sm whitespace-pre-wrap">
                  {list.description}
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-400 italic">No description provided.</div>
              )}
            </div>

            {/* Quick Actions / Stats */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Programs</span>
                  <span className="text-xl font-bold text-[#011936] bg-[#f4f7f9] px-3 py-1 rounded-lg">{list.items?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${list.is_public ? 'bg-[#f8fafc] text-[#00604b]' : 'bg-slate-100 text-slate-600'}`}>
                    {list.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Opportunities List */}
          <div className="lg:col-span-8 lg:mt-0 mt-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#011936]">Programs</h2>
              <Link to="/search" className="btn outline sm text-[#892233] border-[#892233] hover:bg-[#892233] hover:text-white transition-colors bg-white font-bold text-xs px-4 py-2 flex items-center gap-1">
                <Plus size={14} /> Add Programs
              </Link>
            </div>

            <div className="space-y-6">
              {!list.items || list.items.length === 0 ? (
                /* Empty State */
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-[#f4f7f9] text-slate-300 rounded-full flex items-center justify-center mb-4">
                    <MousePointerClick size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-[#011936] mb-2">This list is empty</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6 max-w-sm mx-auto">
                    Start exploring programs and build your custom list to share with students or parents.
                  </p>
                  <Link to="/search" className="btn primary px-6 shadow-md hover:shadow-lg transition-all animate-fade-in hover:-translate-y-0.5 font-bold">
                    <Search className="inline-block mr-2" size={16} /> Look for Programs
                  </Link>
                </div>
              ) : (
                list.items.map((item) => (
                  <div key={item.id} className="relative group">
                    <ProgramCard program={item.program} />
                    
                    {/* Add Author Commentary later if needed */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
