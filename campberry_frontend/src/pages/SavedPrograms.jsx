import { ArrowLeft, Loader2, MousePointerClick, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProgramCard from '../components/ProgramCard'
import { getAuthToken, getSavedPrograms } from '../services/api'

export default function SavedPrograms() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/auth?redirect=/saved-programs', { replace: true })
      return
    }

    const fetchSavedPrograms = async () => {
      try {
        const data = await getSavedPrograms()
        const formatted = data.map((item) => ({
          ...item.program,
          trpcData: {
            ...item.program,
            logo: { url: item.program.logo_url }
          }
        }))
        setPrograms(formatted)
      } catch (err) {
        console.error(err)
        setError('Failed to load saved programs.')
      } finally {
        setLoading(false)
      }
    }

    fetchSavedPrograms()
  }, [navigate])

  if (loading) {
    return (
      <div className="bg-[#f4f7f9] min-h-screen py-20 flex justify-center">
        <Loader2 className="animate-spin text-[#892233]" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#f4f7f9] min-h-screen py-20 text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-4">{error}</h2>
        <button onClick={() => navigate('/my-lists')} className="text-[#892233] hover:underline">Go back to My Lists</button>
      </div>
    )
  }

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-20 animate-fade-in relative z-0">
      <div className="container max-w-6xl pt-8 px-6">
        <div className="mb-8">
          <button onClick={() => navigate('/my-lists')} className="flex items-center gap-2 text-[#892233] hover:text-[#780000] font-bold text-sm transition-colors mb-6">
            <ArrowLeft size={16} /> My Lists
          </button>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-[#011936] leading-tight flex items-center gap-3">
              <span className="text-[#892233]">★</span> Saved Programs
            </h1>
          </div>
          <p className="text-slate-500 font-medium">Programs you have favorited for quick access.</p>
        </div>

        <div className="space-y-6">
          {programs.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#f4f7f9] text-slate-300 rounded-full flex items-center justify-center mb-4">
                <MousePointerClick size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#011936] mb-2">No saved programs yet</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 max-w-sm mx-auto">
                Click the &quot;Save&quot; button on any program to add it to this list.
              </p>
              <Link to="/search" className="btn primary px-6 shadow-md hover:shadow-lg transition-all animate-fade-in hover:-translate-y-0.5 font-bold flex items-center gap-2">
                <Search size={16} /> Look for Programs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program) => (
                <div key={program.id} className="relative group">
                  <ProgramCard program={program} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
