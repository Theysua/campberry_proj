
export default function Badge({ type }) {
  if (!type) return null

  const baseClassName =
    'inline-flex items-center justify-center rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.08em] shadow-sm'

  if (type === 'MOST') {
    return <span className={`${baseClassName} bg-[#892233] text-white`}>Most Recommended</span>
  }
  
  if (type === 'HIGHLY') {
    return <span className={`${baseClassName} bg-[#ff751f] text-white`}>Highly Recommended</span>
  }

  if (type === 'IMPACT_MOST') {
    return <span className={`${baseClassName} bg-[#011936] text-white`}>Most High Impact</span>
  }

  if (type === 'IMPACT_HIGHLY') {
    return <span className={`${baseClassName} bg-[#011936]/70 text-white`}>High Impact</span>
  }
  
  if (type === 'NEW') {
    return <span className={`${baseClassName} bg-[#fade41] text-[#011936]`}>New</span>
  }

  return <span className={`${baseClassName} bg-[#892233] text-white`}>{type}</span>
}
