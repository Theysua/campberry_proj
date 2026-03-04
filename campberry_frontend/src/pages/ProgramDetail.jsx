import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { useListContext } from '../context/ListContext';
import AddToListModal from '../components/AddToListModal';
import { getProgramById } from '../services/api';

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  useScrollReveal();

  const { isProgramSaved, toggleSaveProgram } = useListContext();
  const [addListOpen, setAddListOpen] = useState(false);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    getProgramById(id).then(res => setProgram(res)).catch(e => console.error(e));
  }, [id]);

  const isSaved = isProgramSaved(id);

  if (!program) return <div className="page" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <div className="page" id="page-program">
        <div className="container">
          <button className="btn-outline" onClick={() => navigate('/search')} style={{ 'marginBottom': '24px', 'fontSize': '13px', 'padding': '6px 18px' }}>← Back to Search</button>
          <div className="card program-header" style={{ 'marginBottom': '24px', 'padding': '32px' }}>
            <div style={{ 'width': '100px', 'height': '100px', 'background': 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', 'borderRadius': 'var(--radius-lg)', 'border': '1px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '40px', 'flexShrink': '0' }}>
              {program.logo_url ? <img src={program.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} /> : (program.type === 'COMPETITION' ? '🏆' : '🎓')}</div>
            <div style={{ 'flex': '1' }}>
              <div className="program-title-row">
                <div>
                  <h1 style={{ 'margin': '0 0 8px 0', 'fontSize': '28px', 'color': 'var(--primary)', 'fontWeight': '800', 'letterSpacing': '-0.03em' }}>
                    {program.name}</h1>
                  <div style={{ 'fontSize': '17px', 'color': 'var(--accent)', 'fontWeight': '600', 'marginBottom': '16px' }}>
                    {program.provider?.name || program.provider}</div>
                </div>
                <div className="program-actions" style={{ display: 'flex', gap: '8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <button className="btn-outline">↗ Share</button>
                  <button onClick={() => toggleSaveProgram(id)} className="btn-outline" style={{ color: isSaved ? 'var(--orange)' : 'var(--text)' }}>
                    {isSaved ? '★ Saved' : '☆ Save'}
                  </button>
                  <button className="btn" onClick={() => setAddListOpen(true)}>＋ Add to List</button>
                </div>
              </div>
              <div style={{ 'marginBottom': '12px' }}>
                {program.experts_choice_rating === 'MOST_RECOMMENDED' && <span className="badge-most">MOST RECOMMENDED</span>}
                {program.experts_choice_rating === 'HIGHLY_RECOMMENDED' && <span className="badge-highly">HIGHLY RECOMMENDED</span>}
                {program.impact_rating && <span className="badge-impact">HIGH IMPACT</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {program.interests?.map((i, idx) => (
                  <span key={idx} className="tag">{i.interest?.name || i.interest}</span>
                ))}
                {program.eligible_grades && <span className="tag">Grades {program.eligible_grades}</span>}
              </div>
            </div>
          </div>
          <div className="program-layout" style={{ 'gap': '24px' }}>
            <div>
              <div className="card" style={{ 'marginBottom': '20px', 'padding': '28px' }}>
                <h3 style={{ 'marginTop': '0', 'color': 'var(--primary)', 'fontSize': '18px', 'fontWeight': '700', 'marginBottom': '16px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px' }}>
                  <span style={{ 'width': '4px', 'height': '24px', 'background': 'var(--accent-gradient)', 'borderRadius': '2px', 'display': 'inline-block' }}></span>
                  About the Program
                </h3>
                <p style={{ 'color': 'var(--text-secondary)', 'lineHeight': '1.8', 'fontSize': '15px' }}>
                  {program.description || "No description provided."}
                </p>
                {program.cost_info && <p style={{ marginTop: '12px' }}><strong>Cost: </strong>{program.cost_info}</p>}
                {program.admission_info && <p style={{ marginTop: '12px' }}><strong>Admission: </strong>{program.admission_info}</p>}
                {program.eligibility_info && <p style={{ marginTop: '12px' }}><strong>Eligibility: </strong>{program.eligibility_info}</p>}
                {program.url && <p style={{ marginTop: '12px' }}><a href={program.url} target="_blank" rel="noreferrer" className="btn-outline">Visit Official Website</a></p>}
              </div>
              <div className="card" style={{ 'background': '#fffbef', 'borderColor': '#fde68a', 'padding': '28px' }}>
                <h3 style={{ 'marginTop': '0', 'color': '#92400e', 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'fontSize': '18px', 'fontWeight': '700', 'marginBottom': '12px' }}>
                  ⭐ Expert Guidance
                </h3>
                <p style={{ 'color': '#b45309', 'fontSize': '14px', 'lineHeight': '1.7' }}>Highly competitive and proven to
                  demonstrate deep interest and capability in rigorous academic environments to top-tier
                  universities.</p>
              </div>
            </div>
            <div style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': '16px' }}>
              <div className="card" style={{ 'padding': '24px' }}>
                <h4 style={{ 'margin': '0 0 16px 0', 'color': 'var(--primary)', 'fontSize': '16px', 'fontWeight': '700' }}>Dates &amp; Deadlines</h4>
                {program.deadlines && program.deadlines.length > 0 ? (
                  program.deadlines.map((d, i) => (
                    <div key={i} style={{ 'fontSize': '14px', 'color': 'var(--text-secondary)', 'display': 'flex', 'justifyContent': 'space-between', 'paddingTop': i > 0 ? '12px' : '0', 'borderTop': i > 0 ? '1px solid var(--border-light)' : 'none' }}>
                      <span style={{ 'fontWeight': '600', 'color': 'var(--text)' }}>{d.description}</span>
                      <span>{new Date(d.date).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ 'fontSize': '14px', 'color': 'var(--text-secondary)' }}>No deadlines information available.</div>
                )}

                {program.sessions && program.sessions.length > 0 && <h4 style={{ 'margin': '24px 0 16px 0', 'color': 'var(--primary)', 'fontSize': '16px', 'fontWeight': '700' }}>Sessions</h4>}
                {program.sessions && program.sessions.map((s, i) => (
                  <div key={i} style={{ 'fontSize': '14px', 'color': 'var(--text-secondary)', 'display': 'flex', 'flexDirection': 'column', 'gap': '4px', 'paddingTop': i > 0 ? '12px' : '0', 'borderTop': i > 0 ? '1px solid var(--border-light)' : 'none' }}>
                    {s.start_date && <span>📅 {new Date(s.start_date).toLocaleDateString()} - {new Date(s.end_date).toLocaleDateString()}</span>}
                    {s.location_type && <span>📍 {s.location_type} {s.location_name ? `- ${s.location_name}` : ''}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddToListModal isOpen={addListOpen} onClose={() => setAddListOpen(false)} programId={id} />
    </>
  );
}
