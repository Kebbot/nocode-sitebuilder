import React from 'react';

export default function SelectionBox({ element }) {
    if (!element) return null;
    return (
        <div style={{
            position: 'absolute',
            left: element.x - 4, top: element.y - 4,
            width: element.width + 8, height: element.height + 8,
            border: '1px dashed #4f7cff', borderRadius: 10, pointerEvents: 'none'
        }} />
    );
}