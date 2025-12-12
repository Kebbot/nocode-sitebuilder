import React from 'react';
import { useSelector } from 'react-redux';
import BlockLibrary from '../library/BlockLibrary.jsx';

export default function LeftPanel({ projectId, pageId }) {
    const open = useSelector((s) => s.ui.leftOpen);
    if (!open) return null;

    return (
        <aside
            style={{
                height: '100%',
                borderRight: '1px solid #e5e7eb',
                background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                overflowY: 'auto',
                boxShadow: '2px 0 10px rgba(15,23,42,0.04)'
            }}
        >
            <div
                style={{
                    padding: '8px 10px',
                    borderRadius: 12,
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    boxShadow: '0 4px 12px rgba(15,23,42,0.06)'
                }}
            >
                <span
                    style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#9ca3af'
                    }}
                >
                    Библиотека
                </span>
                <span
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#111827'
                    }}
                >
                    Блоки
                </span>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <BlockLibrary projectId={projectId} pageId={pageId} />
            </div>
        </aside>
    );
}
