import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { useListContext } from '../context/ListContext'
import AddToListModal from '../components/AddToListModal'
import { getProgramById } from '../services/api'

const formatDateRange = (startDate, endDate) => {
  if (!startDate) {
    return null
  }

  const formattedStart = new Date(startDate).toLocaleDateString()
  if (!endDate) {
    return formattedStart
  }

  return `${formattedStart} - ${new Date(endDate).toLocaleDateString()}`
}

const getExpertGuidance = (program) => {
  if (!program?.trpc_data) {
    return null
  }

  try {
    const parsed = JSON.parse(program.trpc_data)
    return parsed.additionalInfo || null
  } catch {
    return null
  }
}

export default function ProgramDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  useScrollReveal()

  const { isProgramSaved, toggleSaveProgram } = useListContext()
  const [addListOpen, setAddListOpen] = useState(false)
  const [program, setProgram] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy program URL', error)
    }
  }

  useEffect(() => {
    getProgramById(id)
      .then((response) => setProgram(response))
      .catch((error) => console.error(error))
  }, [id])

  const isSaved = isProgramSaved(id)
  const expertGuidance = getExpertGuidance(program)

  if (!program) {
    return <div className="page" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <>
      <div className="page" id="page-program">
        <div className="container">
          <button className="btn-outline" onClick={() => navigate('/search')} style={{ marginBottom: '24px', fontSize: '13px', padding: '6px 18px' }}>
            Back to Search
          </button>
          <div className="card program-header" style={{ marginBottom: '24px', padding: '32px' }}>
            <div style={{ width: '100px', height: '100px', background: program.logo_url ? '#ffffff' : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: '0' }}>
              {program.logo_url ? (
                <img src={program.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
              ) : (
                <span>{program.type === 'COMPETITION' ? 'C' : 'P'}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div className="program-title-row">
                <div>
                  <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'var(--primary)', fontWeight: '800', letterSpacing: '-0.03em' }}>
                    {program.name}
                  </h1>
                  <div style={{ fontSize: '17px', color: 'var(--accent)', fontWeight: '600', marginBottom: '16px' }}>
                    {program.provider?.name || program.provider}
                  </div>
                </div>
                <div className="program-actions" style={{ display: 'flex', gap: '8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <button onClick={handleShare} className="btn-outline">
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                  <button onClick={() => toggleSaveProgram(id)} className="btn-outline" style={{ color: isSaved ? 'var(--orange)' : 'var(--text)' }}>
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button className="btn" onClick={() => setAddListOpen(true)}>Add to List</button>
                </div>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {program.experts_choice_rating === 'MOST_RECOMMENDED' && <span className="badge-most">MOST RECOMMENDED</span>}
                {program.experts_choice_rating === 'HIGHLY_RECOMMENDED' && <span className="badge-highly">HIGHLY RECOMMENDED</span>}
                {program.impact_rating === 'MOST_HIGH_IMPACT' && <span className="badge-impact">MOST HIGH IMPACT</span>}
                {program.impact_rating === 'HIGH_IMPACT' && <span className="badge-impact">HIGH IMPACT</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {program.interests?.map((interest, index) => (
                  <span key={index} className="tag">{interest.interest?.name || interest.interest}</span>
                ))}
                {program.eligible_grades && <span className="tag">Grades {program.eligible_grades}</span>}
              </div>
            </div>
          </div>

          <div className="program-layout" style={{ gap: '24px' }}>
            <div>
              <div className="card" style={{ marginBottom: '20px', padding: '28px' }}>
                <h3 style={{ marginTop: '0', color: 'var(--primary)', fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '4px', height: '24px', background: 'var(--accent-gradient)', borderRadius: '2px', display: 'inline-block' }}></span>
                  About the Program
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-line' }}>
                  {program.description || 'No description provided.'}
                </p>
                {program.cost_info && <p style={{ marginTop: '12px', whiteSpace: 'pre-line' }}><strong>Cost: </strong>{program.cost_info}</p>}
                {program.admission_info && <p style={{ marginTop: '12px', whiteSpace: 'pre-line' }}><strong>Admission: </strong>{program.admission_info}</p>}
                {program.eligibility_info && <p style={{ marginTop: '12px', whiteSpace: 'pre-line' }}><strong>Eligibility: </strong>{program.eligibility_info}</p>}
                {program.url && (
                  <p style={{ marginTop: '12px' }}>
                    <a href={program.url} target="_blank" rel="noreferrer" className="btn-outline">Visit Official Website</a>
                  </p>
                )}
              </div>

              {expertGuidance && (
                <div className="card" style={{ background: '#fffbef', borderColor: '#fde68a', padding: '28px' }}>
                  <h3 style={{ marginTop: '0', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
                    Expert Guidance
                  </h3>
                  <p style={{ color: '#b45309', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {expertGuidance}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', color: 'var(--primary)', fontSize: '16px', fontWeight: '700' }}>Dates &amp; Deadlines</h4>
                {program.deadlines && program.deadlines.length > 0 ? (
                  program.deadlines.map((deadline, index) => (
                    <div key={index} style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', paddingTop: index > 0 ? '12px' : '0', borderTop: index > 0 ? '1px solid var(--border-light)' : 'none' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text)' }}>{deadline.description}</span>
                      <span>{new Date(deadline.date).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No deadline information available.</div>
                )}

                {program.sessions && program.sessions.length > 0 && (
                  <h4 style={{ margin: '24px 0 16px 0', color: 'var(--primary)', fontSize: '16px', fontWeight: '700' }}>Sessions</h4>
                )}
                {program.sessions?.map((session, index) => (
                  <div key={index} style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: index > 0 ? '12px' : '0', borderTop: index > 0 ? '1px solid var(--border-light)' : 'none' }}>
                    {formatDateRange(session.start_date, session.end_date) && (
                      <span>Date: {formatDateRange(session.start_date, session.end_date)}</span>
                    )}
                    {session.location_type && (
                      <span>Location: {session.location_type}{session.location_name ? ` - ${session.location_name}` : ''}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddToListModal isOpen={addListOpen} onClose={() => setAddListOpen(false)} programId={id} />
    </>
  )
}
