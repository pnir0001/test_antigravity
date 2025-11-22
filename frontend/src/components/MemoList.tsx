import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Memo } from '../api/api';

interface MemoListProps {
    refreshKey: number;
    onDelete: () => void;
    onSelectMemo: (memo: Memo) => void;
    selectedMemoId?: string;
}

export const MemoList: React.FC<MemoListProps> = ({ refreshKey, onDelete, onSelectMemo, selectedMemoId }) => {
    const [memos, setMemos] = useState<Memo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });

    useEffect(() => {
        const fetchMemos = async () => {
            try {
                setLoading(true);
                const response = await apiClient.listMemos();
                setMemos(response.data || []);
                setError(null);
            } catch (err) {
                setError('Failed to fetch memos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMemos();
    }, [refreshKey]);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteConfirm({ show: true, id });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.id) return;

        try {
            await apiClient.deleteMemo(deleteConfirm.id);
            setDeleteConfirm({ show: false, id: null });
            onDelete();
        } catch (err) {
            console.error('Delete failed:', err);
            alert('削除に失敗しました');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newMemos = [...memos];
        const draggedItem = newMemos[draggedIndex];
        newMemos.splice(draggedIndex, 1);
        newMemos.splice(index, 0, draggedItem);

        setMemos(newMemos);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>;
    if (error) return <div style={{ color: 'var(--danger-color)' }}>{error}</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', opacity: 0.8 }}>Memos ({memos.length})</h2>
            {memos.length === 0 ? (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No memos found.
                </div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {memos.map((memo, index) => (
                        <li
                            key={memo.id}
                            draggable
                            className="glass-card"
                            onClick={() => onSelectMemo(memo)}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            style={{
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'grab',
                                border: selectedMemoId === memo.id ? '1px solid var(--primary-color)' : undefined,
                                background: selectedMemoId === memo.id ? 'rgba(255, 255, 255, 0.6)' : undefined,
                                transform: draggedIndex === index ? 'scale(1.02)' : undefined,
                                opacity: draggedIndex === index ? 0.8 : 1,
                            }}
                        >
                            <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>
                                {memo.title}
                            </span>
                            <button
                                onClick={(e) => handleDeleteClick(e, memo.id)}
                                className="btn-danger"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Custom Confirmation Dialog */}
            {deleteConfirm.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '90%',
                        background: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>確認</h3>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>このメモを削除してもよろしいですか？</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleDeleteCancel}
                                className="btn-secondary"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn-danger"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
