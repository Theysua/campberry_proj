import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { useListContext } from '../context/ListContext';
import AddToListModal from '../components/AddToListModal';

export default function ProgramDetail() {
  const navigate = useNavigate();
  useScrollReveal();

  const { isProgramSaved, toggleSaveProgram } = useListContext();
  const [addListOpen, setAddListOpen] = useState(false);
  const mockId = "stanford-pre-college";
  const isSaved = isProgramSaved(mockId);

  return (
    <>
      <div className="page" id="page-program">
        <div className="container">
          <button className="btn-outline" onClick={() => navigate('/search')} style={{ 'marginBottom': '24px', 'fontSize': '13px', 'padding': '6px 18px' }}>← Back to Search</button>
          <div className="card program-header" style={{ 'marginBottom': '24px', 'padding': '32px' }}>
            <div style={{ 'width': '100px', 'height': '100px', 'background': 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', 'borderRadius': 'var(--radius-lg)', 'border': '1px solid var(--border)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '40px', 'flexShrink': '0' }}>
              🎓</div>
            <div style={{ 'flex': '1' }}>
              <div className="program-title-row">
                <div>
                  <h1 style={{ 'margin': '0 0 8px 0', 'fontSize': '28px', 'color': 'var(--primary)', 'fontWeight': '800', 'letterSpacing': '-0.03em' }}>
                    Stanford Pre-Collegiate Summer Institutes</h1>
                  <div style={{ 'fontSize': '17px', 'color': 'var(--accent)', 'fontWeight': '600', 'marginBottom': '16px' }}>
                    Stanford University</div>
                </div>
                <div className="program-actions">
                  <button className="btn-outline">↗ Share</button>
                  <button onClick={() => toggleSaveProgram(mockId)} className="btn-outline" style={{ color: isSaved ? 'var(--orange)' : 'var(--text)' }}>
                    {isSaved ? '★ Saved' : '☆ Save'}
                  </button>
                  <button className="btn" onClick={() => setAddListOpen(true)}>＋ Add to List</button>
                </div>
              </div>
              <div style={{ 'marginBottom': '12px' }}>
                <span className="badge-most">MOST RECOMMENDED</span>
                <span className="badge-impact">HIGH IMPACT</span>
              </div>
              <div>
                <span className="tag">STEM</span>
                <span className="tag">Summer</span>
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
                <p style={{ 'color': 'var(--text-secondary)', 'lineHeight': '1.8', 'fontSize': '15px' }}>Stanford
                  Pre-Collegiate Summer Institutes offer intellectually curious students the opportunity to
                  study a wide range of subjects taught by Stanford instructors. The program provides a
                  challenging academic experience in a supportive environment, helping students explore their
                  interests and prepare for college-level coursework.</p>
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
                <h4 style={{ 'margin': '0 0 16px 0', 'color': 'var(--primary)', 'fontSize': '16px', 'fontWeight': '700' }}>Dates
                  &amp; Deadlines</h4>
                <div style={{ 'fontSize': '14px', 'color': 'var(--text-secondary)', 'marginBottom': '12px', 'display': 'flex', 'justifyContent': 'space-between' }}>
                  <span style={{ 'fontWeight': '600', 'color': 'var(--text)' }}>Starts</span>
                  <span>June 20, 2026</span>
                </div>
                <div style={{ 'fontSize': '14px', 'color': 'var(--text-secondary)', 'display': 'flex', 'justifyContent': 'space-between', 'paddingTop': '12px', 'borderTop': '1px solid var(--border-light)' }}>
                  <span style={{ 'fontWeight': '600', 'color': 'var(--text)' }}>Apply by</span>
                  <span>Jan 15, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddToListModal isOpen={addListOpen} onClose={() => setAddListOpen(false)} programId={mockId} />
    </>
  );
}
