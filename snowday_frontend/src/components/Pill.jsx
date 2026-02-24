import { X } from 'lucide-react'

export default function Pill({ text, onRemove }) {
  return (
    <span className="pill">
      {text}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 focus:outline-none" aria-label="Remove filter">
          <X size={12} />
        </button>
      )}
    </span>
  )
}
