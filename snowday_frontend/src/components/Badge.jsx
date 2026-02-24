
export default function Badge({ type }) {
  if (!type) return null

  if (type === 'MOST') {
    return <span className="badge px-4 shadow-sm bg-[#892233]">EXPERTS' CHOICE</span>
  }
  
  if (type === 'HIGHLY') {
    return <span className="badge px-4 shadow-sm bg-[#ff751f]">EXPERTS' CHOICE</span>
  }

  if (type === 'IMPACT_MOST') {
    return <span className="badge px-4 shadow-sm bg-[#011936] text-white">MOST HIGH IMPACT</span>
  }

  if (type === 'IMPACT_HIGHLY') {
    return <span className="badge px-4 shadow-sm bg-[#011936]/70 text-white">HIGH IMPACT</span>
  }
  
  if (type === 'NEW') {
    return <span className="badge shadow-sm bg-[#fade41] text-[#011936]">NEW</span>
  }

  return <span className="badge shadow-sm bg-[#892233]">{type}</span>
}
