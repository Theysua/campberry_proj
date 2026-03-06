import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import ListCard from '../components/ListCard'
import useScrollReveal from '../hooks/useScrollReveal'
import { getLists } from '../services/api'

export default function Lists() {
  useScrollReveal()
  const [publicLists, setPublicLists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPublicLists = async () => {
      try {
        const response = await getLists()
        setPublicLists(response)
      } catch (error) {
        console.error('Failed to load public lists:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPublicLists()
  }, [])

  return (
    <div className="bg-[#f4f7f9] min-h-screen pb-20 animate-fade-in relative z-0">
      <div className="container max-w-6xl pt-10 px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#892233] mb-3">Curated Lists</div>
          <h1 className="text-4xl font-bold text-[#011936] mb-3 leading-tight">Browse public program lists</h1>
          <p className="text-slate-600 text-base leading-7">
            Explore Campberry&apos;s public collections of summer programs, competitions, and standout opportunities
            assembled for students and families.
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center">
            <Loader2 className="animate-spin text-[#892233]" size={32} />
            <p className="mt-4 text-slate-500 font-medium">Loading public lists...</p>
          </div>
        ) : publicLists.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#011936] mb-2">No public lists yet</h2>
            <p className="text-slate-500 font-medium">Public curated lists will appear here once they are published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {publicLists.map((list) => (
              <ListCard key={list.id} list={{ ...list, width: 'w-full' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
