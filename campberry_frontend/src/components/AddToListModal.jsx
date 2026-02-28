import React, { useState } from 'react';
import { useListContext } from '../context/ListContext';

export default function AddToListModal({ isOpen, onClose, programId }) {
    const { userLists, createList, addProgramToList } = useListContext();
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');

    if (!isOpen) return null;

    const handleAddToList = (listId) => {
        addProgramToList(programId, listId);
        onClose();
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (newListName.trim()) {
            const newList = createList(newListName.trim(), newListDescription.trim());
            addProgramToList(programId, newList.id);
            setNewListName('');
            setNewListDescription('');
            setIsCreating(false);
            onClose();
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
            <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                    &times;
                </button>
                <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--primary)' }}>Add to List</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '24px' }}>
                    {userLists.map(list => {
                        const isAdded = list.programs.includes(programId);
                        return (
                            <button
                                key={list.id}
                                onClick={() => !isAdded && handleAddToList(list.id)}
                                className={isAdded ? "btn-outline" : "btn"}
                                style={{ justifyContent: 'space-between', padding: '12px 16px', opacity: isAdded ? 0.7 : 1, cursor: isAdded ? 'default' : 'pointer' }}
                                disabled={isAdded}
                            >
                                <span>{list.name}</span>
                                {isAdded ? <span>&#10003; Added</span> : <span>+ Add</span>}
                            </button>
                        );
                    })}
                </div>

                {isCreating ? (
                    <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                        <input
                            type="text"
                            placeholder="New list name..."
                            className="form-input"
                            value={newListName}
                            onChange={e => setNewListName(e.target.value)}
                            autoFocus
                            required
                        />
                        <textarea
                            placeholder="Description (optional)..."
                            className="form-input"
                            value={newListDescription}
                            onChange={e => setNewListDescription(e.target.value)}
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
                        ＋ Create New List
                    </button>
                )}
            </div>
        </div>
    );
}
