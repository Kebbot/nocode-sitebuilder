import React from 'react';
import { useSelector } from 'react-redux';
import PropertiesPanel from '../properties/PropertiesPanel.jsx';

export default function RightPanel({ projectId, pageId }) {
    const open = useSelector((s) => s.ui.rightOpen);
    if (!open) return null;

    return (
        <aside
            style={{
                height: '100%',
                borderLeft: '1px solid #e5e7eb',
                background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                padding: 0,
                overflow: 'hidden',
                boxShadow: '-2px 0 10px rgba(15,23,42,0.04)'
            }}
        >
            <PropertiesPanel projectId={projectId} pageId={pageId} />
        </aside>
    );
}
