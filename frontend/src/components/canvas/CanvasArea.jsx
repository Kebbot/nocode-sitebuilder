// frontend/src/components/canvas/CanvasArea.jsx
import React from 'react';
import Canvas from './Canvas.jsx';

/**
 * Обёртка над Canvas — сейчас просто передаёт props.
 * Оставляем как отдельный компонент на будущее (сюда можно будет добавить
 * линейки, мини-карту, подсказки и т.п.).
 */
export default function CanvasArea({ projectId, pageId, elements }) {
    return (
        <div style={{ display: 'flex', minHeight: 0 }}>
            <Canvas projectId={projectId} pageId={pageId} elements={elements} />
        </div>
    );
}
