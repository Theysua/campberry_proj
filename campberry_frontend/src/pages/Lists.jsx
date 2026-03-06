import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import CreateListModal from '../components/CreateListModal';
import { useListContext } from '../context/ListContext';
import { getLists } from '../services/api';

export default function Lists() {
  const navigate = useNavigate();
  useScrollReveal();
  const { userLists } = useListContext();
  const [isCreating, setIsCreating] = useState(false);
  const [publicLists, setPublicLists] = useState([]);

  useEffect(() => {
    getLists().then((res) => setPublicLists(res)).catch((error) => console.error(error));
  }, []);

  const gradients = [
    'linear-gradient(135deg, var(--primary) 0%, #0a2f5c 100%)',
    'var(--accent-gradient)',
    'linear-gradient(135deg, var(--orange) 0%, var(--yellow) 100%)'
  ];

  return (
    <>
      <div className="page" id="page-lists">
        <div className="container" style={{ paddingBottom: '80px' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Your Workspace
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '22px', fontWeight: '700', color: 'var(--text)' }}>My Lists</h2>
            <button className="btn" onClick={() => setIsCreating(true)}>Create New List</button>
          </div>
          <div className="l1-grid" style={{ marginBottom: '48px' }}>
            {userLists.map((list) => (
              <div key={list.id} className="card" onClick={() => navigate(`/my-lists/${list.id}`)} style={{ cursor: 'pointer' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary)', fontSize: '16px', fontWeight: '700' }}>
                  {list.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border)', marginTop: '15px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{list._count?.items || 0} Programs</span>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--border-light)', color: 'var(--text-secondary)', fontWeight: '700' }}>{list.is_public ? 'Public' : 'Private'}</span>
                </div>
              </div>
            ))}
            {userLists.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)' }}>
                You haven&apos;t created any lists yet.
              </div>
            )}
          </div>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700', color: 'var(--text)' }}>Featured Lists</h2>
          <div className="hot-row">
            {publicLists.slice(0, 3).map((list, index) => (
              <div key={list.id} className="hot-card" onClick={() => navigate(`/lists/${list.id}`)} style={{ borderTop: 'none' }}>
                <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '4px', background: gradients[index % gradients.length], borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                <h4>{list.title}</h4>
                <div className="meta">By {list.author?.name || 'Anonymous'}</div>
              </div>
            ))}
            {publicLists.length === 0 && <span style={{ color: 'var(--text-secondary)' }}>No featured lists found.</span>}
          </div>
        </div>
      </div>
      <CreateListModal isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </>
  );
}
