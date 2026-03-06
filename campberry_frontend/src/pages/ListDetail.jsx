import { ArrowLeft, Loader2, Share } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ProgramCard from '../components/ProgramCard'
import { getListById } from '../services/api'
import { getBackTarget } from '../utils/navigationContext'

export default function ListDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getListById(id)

        if (data.items) {
          data.items = data.items.map((item) => ({
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
        setError('Failed to load list. It may not exist or is private.')
      } finally {
        setLoading(false)
      }
    }

    fetchList()
  }, [id])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy list URL', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-20 flex justify-center">
        <Loader2 className="animate-spin text-[#892233]" size={32} />
      </div>
    )
  }

  const backTarget = getBackTarget(location, '/lists', 'Back to Lists')

  if (error || !list) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-20 text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-4">{error || 'List not found'}</h2>
        <button onClick={() => navigate(backTarget.path)} className="text-blue-600 hover:underline">{backTarget.label}</button>
      </div>
    )
  }

  const feedbackSummary = list.feedback_summary || { averageRating: null, ratingCount: 0, commentCount: 0 }
  const feedbackPreview = Array.isArray(list.feedback_preview) ? list.feedback_preview : []

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in relative z-0">
      <div className="container max-w-3xl pt-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(backTarget.path)} className="btn outline sm text-slate-600 border-slate-300 hover:bg-slate-100 bg-white shadow-sm">
            <ArrowLeft size={14} /> {backTarget.label}
          </button>
          <button className="btn outline sm text-slate-600 border-slate-300 hover:bg-slate-100 bg-white shadow-sm" onClick={handleShare}>
            <Share size={14} /> {copied ? 'Copied' : 'Share'}
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#011936] leading-tight mb-2">{list.title}</h1>
          <div className="text-sm text-slate-600 mb-1 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs uppercase scale-110">
              {list.author?.name?.substring(0, 2) || 'SC'}
            </div>
            From <span className="font-semibold text-blue-600">{list.author?.name || 'Unknown Author'}</span>
          </div>
          <div className="text-xs text-slate-400 mb-5">
            Updated {new Date(list.updated_at).toLocaleDateString()}
          </div>

          {list.description && (
            <div className="text-slate-700 leading-relaxed whitespace-pre-line bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-2">
              {list.description}
            </div>
          )}

          {(feedbackSummary.ratingCount > 0 || feedbackPreview.length > 0) && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#892233] mb-1">Community Feedback</div>
                  <h2 className="text-lg font-bold text-[#011936]">
                    {feedbackSummary.averageRating ? `${feedbackSummary.averageRating}/5 average rating` : 'Feedback available'}
                  </h2>
                </div>
                <div className="text-sm text-slate-500">
                  {feedbackSummary.ratingCount} ratings · {feedbackSummary.commentCount} comments
                </div>
              </div>

              {feedbackPreview.length > 0 && (
                <div className="space-y-3">
                  {feedbackPreview.map((review) => (
                    <div key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3 text-sm mb-1">
                        <span className="font-semibold text-[#011936]">{review.user?.name || 'Campberry Member'}</span>
                        <span className="text-slate-500">{review.rating}/5</span>
                      </div>
                      <div className="text-sm text-slate-600 leading-relaxed">{review.comment}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <hr className="border-slate-200 my-8" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#011936]">{list.items?.length || 0} Opportunities</h2>
        </div>

        <div className="space-y-8">
          {!list.items || list.items.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No programs have been added to this list yet.
            </div>
          ) : (
            list.items.map((item) => (
              <div key={item.id}>
                <ProgramCard program={item.program} />

                {item.author_commentary && (
                  <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 mt-4 ml-6 shadow-sm relative">
                    <div className="absolute -left-3 top-6 w-3 h-[2px] bg-blue-200" />
                    <div className="absolute -left-[18px] top-0 bottom-6 w-[2px] bg-blue-200" />

                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      Author&apos;s Commentary
                    </div>
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      "{item.author_commentary}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
