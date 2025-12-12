import React from 'react';
import Canvas from '../canvas/Canvas.jsx';

export default function CanvasArea({ projectId, pageId, elements }) {
    return (
        <div style={{ position: 'relative', overflow: 'auto', background: '#f4f7fb' }}>
            <Canvas projectId={projectId} pageId={pageId} elements={elements} />
        </div>
    );
}