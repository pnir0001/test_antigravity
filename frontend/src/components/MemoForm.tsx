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
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h2>{isEditing ? 'Edit Memo' : 'Create New Memo'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Title:
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                        disabled={loading}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Content:
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' }}
                        disabled={loading}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            borderRadius: '4px'
                        }}
                    >
                        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Memo' : 'Create Memo')}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            style={{
                                backgroundColor: '#f0f0f0',
                                color: '#333',
                                border: '1px solid #ddd',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                borderRadius: '4px'
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
