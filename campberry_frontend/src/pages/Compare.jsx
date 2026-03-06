import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useListContext } from '../context/ListContext';
import useScrollReveal from '../hooks/useScrollReveal';
import { ArrowLeft, Briefcase, Check, Trophy, X } from 'lucide-react';
import { getProgramById } from '../services/api';
import { buildProgramDetailPath, getBackTarget } from '../utils/navigationContext';

const formatSessionDate = (session) => {
    if (!session?.start_date) {
        return null;
    }

    const start = new Date(session.start_date).toLocaleDateString();
    if (!session.end_date) {
        return start;
    }

    return `${start} - ${new Date(session.end_date).toLocaleDateString()}`;
};

export default function Compare() {
    const { compareList, toggleCompare, clearCompare } = useListContext();
    const navigate = useNavigate();
    const location = useLocation();
    useScrollReveal();

    const [detailedPrograms, setDetailedPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const backTarget = getBackTarget(location, '/search', 'Back to Search');

    useEffect(() => {
        if (compareList.length === 0) {
            navigate(backTarget.path, { replace: true });
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const results = await Promise.allSettled(compareList.map((program) => getProgramById(program.id)));
                setDetailedPrograms(
                    results
                        .filter((result) => result.status === 'fulfilled')
                        .map((result) => result.value)
                        .filter(Boolean)
                );
            } catch (err) {
                console.error('Failed to fetch details for comparison', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [backTarget.path, compareList, navigate]);

    if (loading) {
        return <div className="page" style={{ padding: '40px', textAlign: 'center' }}>Loading Comparison...</div>;
    }

    return (
        <div className="page" id="page-compare">
            <div className="container" style={{ maxWidth: '1400px', minHeight: '60vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <button className="btn-outline" onClick={() => navigate(backTarget.path)} style={{ marginBottom: '16px', fontSize: '13px', padding: '6px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <ArrowLeft size={14} /> {backTarget.label}
                        </button>
                        <h1 style={{ margin: 0, fontSize: '32px', color: 'var(--primary)', fontWeight: '800' }}>Compare Programs</h1>
                    </div>
                    <button className="btn-outline" onClick={clearCompare}>Clear Comparison</button>
                </div>

                <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px' }}>
                    {detailedPrograms.map((program) => (
                        <div key={program.id} className="card" style={{ flex: '1', minWidth: '300px', maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
                                <button
                                    onClick={() => toggleCompare(program)}
                                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--bg-alt)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                >
                                    <X size={16} />
                                </button>
                                <div style={{ width: '64px', height: '64px', background: program.logo_url ? '#ffffff' : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                                    {program.logo_url ? (
                                        <img src={program.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                    ) : program.type === 'COMPETITION' ? (
                                        <Trophy size={24} color="var(--text-secondary)" />
                                    ) : (
                                        <Briefcase size={24} color="var(--text-secondary)" />
                                    )}
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--primary)' }}>{program.name}</h3>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{program.provider?.name || program.provider}</div>
                                <div style={{ marginTop: '16px' }}>
                                    <button className="btn" style={{ width: '100%' }} onClick={() => navigate(buildProgramDetailPath(program.id, location))}>View Details</button>
                                </div>
                            </div>

                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>Description</div>
                                    <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{program.description ? (program.description.length > 150 ? `${program.description.substring(0, 150)}...` : program.description) : 'N/A'}</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>Cost & Funding</div>
                                    <p style={{ fontSize: '14px', margin: 0 }}>{program.cost_info || 'N/A'}</p>
                                    {program.cost_info?.toLowerCase().includes('free') && <span className="badge-impact mt-2 inline-block">Free Program</span>}
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>Eligibility</div>
                                    <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Check size={14} color="var(--accent)" /> {program.eligible_grades ? `Grades ${program.eligible_grades}` : 'All Grades'}
                                        </div>
                                        {program.allows_international && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Check size={14} color="var(--accent)" /> International Students Welcome
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>Sessions & Location</div>
                                    <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {program.sessions?.slice(0, 2).map((session, index) => (
                                            <div key={index} style={{ background: 'var(--bg-alt)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                                                <div style={{ fontWeight: '600', marginBottom: '2px' }}>{session.location_type} {session.location_name ? `- ${session.location_name}` : ''}</div>
                                                {formatSessionDate(session) && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{formatSessionDate(session)}</div>}
                                            </div>
                                        ))}
                                        {program.sessions?.length === 0 && 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
