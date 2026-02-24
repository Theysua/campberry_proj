
export default function Badge({ type }) {
  if (!type) return null

  if (type === 'MOST') {
    return <span className="badge px-4 shadow-sm bg-[#892233]">MOST</span>
  }
  
  if (type === 'HIGHLY') {
    return <span className="badge px-4 shadow-sm bg-[#ff751f]">HIGHLY</span>
  }
  
  if (type === 'NEW') {
    return <span className="badge shadow-sm bg-[#fade41] text-[#011936]">NEW</span>
  }

  return <span className="badge shadow-sm bg-[#892233]">{type}</span>
}
