// frontend/src/components/canvas/CanvasGrid.jsx
import React from 'react';

/**
 * Лёгкий фон-сетка, как в Figma.
 * Реализован через background-image + background-size.
 */
export default function CanvasGrid({ gridSize = 8 }) {
    const size = Math.max(4, gridSize);

    const backgroundImage = `
      linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)
    `;

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage,
                backgroundSize: `${size}px ${size}px`
            }}
        />
    );
}
