import { Link } from 'react-router-dom'

export default function ListCard({ list }) {
  const { id, title, author, authorRole, width = "w-[280px]" } = list

  return (
    <Link to={`/lists/${id}`} className={`card flex flex-col ${width} shrink-0 hover:-translate-y-1 !p-5 group`}>
      <h3 className="text-[14px] font-bold text-[#011936] group-hover:text-[#892233] transition-colors leading-snug mb-5 flex-1 break-words">
        {title}
      </h3>
      
      <div className="flex items-center gap-3 mt-auto">
        <div className="icon-box w-10 h-10 bg-[#ddfff7] text-[#892233] shadow-sm border border-[#892233]/10">
          👤
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-800 tracking-tight">{author}</div>
          <div className="text-[10px] text-slate-500">{authorRole}</div>
        </div>
      </div>
    </Link>
  )
}
