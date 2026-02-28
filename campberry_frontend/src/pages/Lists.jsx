import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { useListContext } from '../context/ListContext';
import CreateListModal from '../components/CreateListModal';

export default function Lists() {
  const navigate = useNavigate();
  useScrollReveal();
  const { userLists } = useListContext();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <div className="page" id="page-lists">
        <div className="container" style={{ paddingBottom: '80px' }}>
          <h1 style={{ 'color': 'var(--primary)', 'marginBottom': '8px', 'fontSize': '32px', 'fontWeight': '800', 'letterSpacing': '-0.03em' }}>
            Your Workspace</h1>
          <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': '24px' }}>
            <h2 style={{ 'margin': '0', 'fontSize': '22px', 'fontWeight': '700', 'color': 'var(--text)' }}>My Lists</h2>
            <button className="btn" onClick={() => setIsCreating(true)}>＋ Create New List</button>
          </div>
          <div className="l1-grid" style={{ 'marginBottom': '48px' }}>
            {userLists.map(list => (
              <div key={list.id} className="card" onClick={() => navigate(`/my-lists/${list.id}`)} style={{ 'cursor': 'pointer' }}>
                <h3 style={{ 'margin': '0 0 8px 0', 'color': 'var(--primary)', 'fontSize': '16px', 'fontWeight': '700' }}>
                  {list.name}
                </h3>
                <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'paddingTop': '15px', 'borderTop': '1px solid var(--border)', 'marginTop': '15px' }}>
                  <span style={{ 'fontSize': '13px', 'fontWeight': '600', 'color': 'var(--text-secondary)' }}>{list.programs.length} Programs</span>
                  <span style={{ 'fontSize': '11px', 'padding': '4px 10px', 'borderRadius': 'var(--radius-pill)', 'background': 'var(--border-light)', 'color': 'var(--text-secondary)', 'fontWeight': '700' }}>Private</span>
                </div>
              </div>
            ))}
          </div>
          <h2 style={{ 'margin': '0 0 24px 0', 'fontSize': '22px', 'fontWeight': '700', 'color': 'var(--text)' }}>Hot Programs</h2>
          <div className="hot-row">
            <div className="hot-card" onClick={() => navigate('/my-lists/1')} style={{ 'borderTop': 'none' }}>
              <div style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': '4px', 'background': 'linear-gradient(135deg, var(--primary) 0%, #0a2f5c 100%)', 'borderRadius': 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              </div>
              <h4>Counselors' Top Picks</h4>
              <div className="meta">12 Programs inside</div>
            </div>
            <div className="hot-card" style={{ 'borderTop': 'none' }}>
              <div style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': '4px', 'background': 'var(--accent-gradient)', 'borderRadius': 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              </div>
              <h4>Best STEM Programs</h4>
              <div className="meta">8 Programs</div>
            </div>
            <div className="hot-card" style={{ 'borderTop': 'none' }}>
              <div style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': '4px', 'background': 'linear-gradient(135deg, var(--orange) 0%, var(--yellow) 100%)', 'borderRadius': 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              </div>
              <h4>Free Programs</h4>
              <div className="meta">15 Programs</div>
            </div>
          </div>
        </div>
      </div>
      <CreateListModal isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </>
  );
}
