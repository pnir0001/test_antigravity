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

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Memos</h2>
            {memos.length === 0 ? (
                <p>No memos found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {memos.map((memo, index) => (
                        <li
                            key={memo.id}
                            draggable
                            onClick={() => onSelectMemo(memo)}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            style={{
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                width: '100%',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                backgroundColor: selectedMemoId === memo.id ? '#e6f7ff' : (draggedIndex === index ? '#f0f0f0' : 'transparent'),
                                border: selectedMemoId === memo.id ? '2px solid #1890ff' : '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        >
                            <span style={{ flex: 1 }}>{memo.title}</span>
                            <button
                                onClick={(e) => handleDeleteClick(e, memo.id)}
                                style={{
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.25rem 0.75rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    borderRadius: '4px'
                                }}
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
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h3 style={{ marginTop: 0 }}>確認</h3>
                        <p>このメモを削除してもよろしいですか？</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                onClick={handleDeleteCancel}
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    color: '#333',
                                    border: '1px solid #ddd',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                style={{
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
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
