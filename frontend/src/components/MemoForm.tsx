import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Memo } from '../api/api';

interface MemoFormProps {
    onSuccess: () => void;
    selectedMemo: Memo | null;
    onClearSelection: () => void;
}

export const MemoForm: React.FC<MemoFormProps> = ({ onSuccess, selectedMemo, onClearSelection }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const isEditing = selectedMemo !== null;

    useEffect(() => {
        if (selectedMemo) {
            setTitle(selectedMemo.title);
            setContent(selectedMemo.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [selectedMemo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Title and content are required');
            return;
        }

        try {
            setLoading(true);
            if (isEditing && selectedMemo) {
                await apiClient.updateMemo(selectedMemo.id, { title, content });
            } else {
                await apiClient.createMemo({ title, content });
            }
            setTitle('');
            setContent('');
            onSuccess();
        } catch (err) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} memo`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        onClearSelection();
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{isEditing ? 'Edit Memo' : 'Create New Memo'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        disabled={loading}
                        placeholder="Enter memo title..."
                    />
                </div>
                <div style={{ marginBottom: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', flex: 1, boxSizing: 'border-box', resize: 'none', minHeight: '200px' }}
                        disabled={loading}
                        placeholder="Write your thoughts here..."
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Memo' : 'Create Memo')}
                    </button>
                </div>
            </form>
        </div>
    );
};
