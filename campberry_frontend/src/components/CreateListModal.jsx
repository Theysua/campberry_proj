import React, { useState } from 'react';
import { useListContext } from '../context/ListContext';

export default function CreateListModal({ isOpen, onClose }) {
    const { createList } = useListContext();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            createList(name.trim(), description.trim());
            setName('');
            setDescription('');
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
            <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px', position: 'relative', padding: '32px' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                    &times;
                </button>
                <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', color: 'var(--primary)' }}>Create New List</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                            List Name <span style={{ color: 'var(--orange)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Summer 2026 Targets"
                            className="form-input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoFocus
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                            Description
                        </label>
                        <textarea
                            placeholder="What kind of programs are you looking for?"
                            className="form-input"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            style={{ width: '100%', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn" style={{ flex: 1, justifyContent: 'center' }} disabled={!name.trim()}>
                            Create List
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
