import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListContext } from '../context/ListContext';

export default function AddToListModal({ isOpen, onClose, programId, preferredListId = '', preferredListTitle = '' }) {
    const { userLists, listsLoading, refreshLists, createList, addProgramToList } = useListContext();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [successList, setSuccessList] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        refreshLists().catch(() => {
            setError('Failed to load your lists.');
        });
    }, [isOpen, refreshLists]);

    const sortedLists = [...userLists].sort((left, right) => {
        if (left.id === preferredListId) {
            return -1;
        }

        if (right.id === preferredListId) {
            return 1;
        }

        return 0;
    });

    if (!isOpen) return null;

    const handleAddToList = async (listId) => {
        setError('');
        try {
            const updatedList = await addProgramToList(programId, listId);
            setSuccessList(updatedList || userLists.find((list) => list.id === listId) || null);
        } catch (e) {
            console.error(e);
            setError('Failed to add this program to the selected list.');
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newListName.trim()) {
            return;
        }

        setError('');
        try {
            const newList = await createList(newListName.trim(), newListDescription.trim());
            const updatedList = await addProgramToList(programId, newList.id);
            setSuccessList(updatedList || newList);
            setNewListName('');
            setNewListDescription('');
            setIsCreating(false);
        } catch (e) {
            console.error(e);
            setError('Failed to create a new list.');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            {successList ? (
                <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px', position: 'relative', textAlign: 'center', padding: '40px 24px' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                    <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '24px', color: 'var(--primary)', fontWeight: '800' }}>Added to List!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
                        Successfully saved to <strong>{successList.title}</strong>.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button className="btn-outline" style={{ flex: 1, padding: '10px 16px', justifyContent: 'center' }} onClick={onClose}>Keep Browsing</button>
                        <button className="btn" style={{ flex: 1, padding: '10px 16px', justifyContent: 'center' }} onClick={() => { onClose(); navigate(`/my-lists/${successList.id}`); }}>View List</button>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px', position: 'relative' }}>
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                        &times;
                    </button>
                    <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--primary)' }}>Add to List</h2>

                    <style>{`
                    .modal-list-btn:hover {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 6px 16px rgba(137, 34, 51, 0.15) !important;
                    }
                    .modal-list-container {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        max-height: 300px;
                        overflow-y: auto;
                        overflow-x: hidden;
                        margin-bottom: 24px;
                        padding: 4px;
                        margin-left: -4px;
                        margin-right: -4px;
                    }
                `}</style>
                    <div className="modal-list-container">
                        {listsLoading && (
                            <div style={{ padding: '18px 4px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Loading your lists...
                            </div>
                        )}

                        {!listsLoading && sortedLists.map((list) => {
                            const isAdded = list.items?.some((item) => item.program_id === programId);
                            return (
                                <button
                                    key={list.id}
                                    onClick={() => !isAdded && handleAddToList(list.id)}
                                    className={isAdded ? 'btn-outline modal-list-btn' : 'btn modal-list-btn'}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        opacity: isAdded ? 0.7 : 1,
                                        cursor: isAdded ? 'default' : 'pointer'
                                    }}
                                    disabled={isAdded}
                                >
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left', marginRight: '8px' }}>{list.title}</span>
                                    <span style={{ flexShrink: 0 }}>{isAdded ? '✓ Added' : '+ Add'}</span>
                                </button>
                            );
                        })}

                        {!listsLoading && userLists.length === 0 && !isCreating && (
                            <div style={{ padding: '18px 4px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                You do not have any personal lists yet.
                            </div>
                        )}
                    </div>

                    {preferredListId && !listsLoading && (
                        <div style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Current destination: <strong>{preferredListTitle || 'selected list flow'}</strong>
                        </div>
                    )}

                    {error && (
                        <div style={{ marginBottom: '16px', color: '#892233', fontSize: '13px' }}>{error}</div>
                    )}

                    {isCreating ? (
                        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <input
                                type="text"
                                placeholder="New list name..."
                                className="form-input"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                autoFocus
                                required
                            />
                            <textarea
                                placeholder="Description (optional)..."
                                className="form-input"
                                value={newListDescription}
                                onChange={(e) => setNewListDescription(e.target.value)}
                                rows={2}
                                style={{ resize: 'vertical' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn" style={{ flex: 1, justifyContent: 'center' }}>Create & Add</button>
                                <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsCreating(false)}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed' }} onClick={() => setIsCreating(true)}>
                            Create New List
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
