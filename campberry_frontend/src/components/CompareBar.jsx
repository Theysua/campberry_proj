import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useListContext } from '../context/ListContext';
import { X } from 'lucide-react';
import { buildCurrentPath, getDefaultBackLabel, withSearchParams } from '../utils/navigationContext';

export default function CompareBar() {
    const { compareList, clearCompare, toggleCompare } = useListContext();
    const navigate = useNavigate();
    const location = useLocation();

    if (compareList.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: 'white',
            borderTop: '1px solid var(--border)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            zIndex: 100,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            transform: 'translateY(0)',
            animation: 'slideUp 0.3s ease-out'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                    {compareList.length} / 3 Selected
                </span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {compareList.map(prog => (
                        <div key={prog.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--bg-alt)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-light)'
                        }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prog.name || prog.title || "Untitled"}
                            </span>
                            <button
                                onClick={() => toggleCompare(prog)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    className="btn"
                    onClick={() => navigate(withSearchParams('/compare', {
                        returnTo: buildCurrentPath(location),
                        returnLabel: getDefaultBackLabel(location.pathname),
                    }))}
                    disabled={compareList.length < 2}
                >
                    Compare Now
                </button>
                <button className="btn-outline" onClick={clearCompare}>
                    Clear All
                </button>
            </div>

            <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
