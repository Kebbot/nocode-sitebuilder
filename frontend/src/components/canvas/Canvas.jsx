// frontend/src/components/canvas/Canvas.jsx
import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import DraggableElement from './DraggableElement.jsx';
import CanvasGrid from './CanvasGrid.jsx';

/**
 * Основной Canvas: большое "полотно" со скроллом и сеткой.
 * Элементы позиционируются абсолютно внутри stage.
 */
export default function Canvas({ projectId, pageId, elements }) {
    const { gridSize, snapToGrid } = useSelector((s) => s.ui);
    const stageRef = useRef(null);

    // Размер виртуального полотна (можно увеличить при желании)
    const CANVAS_WIDTH = 1600;
    const CANVAS_HEIGHT = 2000;

    // снап по сетке
    const onDragCompute = useMemo(() => {
        return ({ x, y }) => {
            if (!snapToGrid || !gridSize) {
                return { x, y };
            }
            const s = gridSize;
            const nx = Math.round(x / s) * s;
            const ny = Math.round(y / s) * s;
            return { x: nx, y: ny };
        };
    }, [snapToGrid, gridSize]);

    // максимальный zIndex среди элементов
    const maxZ = useMemo(() => {
        if (!Array.isArray(elements) || elements.length === 0) return 0;
        return elements.reduce((acc, el) => {
            const z = typeof el.zIndex === 'number' ? el.zIndex : 0;
            return z > acc ? z : acc;
        }, 0);
    }, [elements]);

    const [selectedId, setSelectedId] = React.useState(null);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleStageClick = () => {
        setSelectedId(null);
        window.__nsb_selected = null;
        window.dispatchEvent(new Event('nsb-select'));
    };

    return (
        <div
            style={{
                flex: 1,
                overflow: 'auto',
                background: '#f1f5f9'
            }}
            onMouseDown={handleStageClick}
        >
            <div
                ref={stageRef}
                style={{
                    position: 'relative',
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                    margin: '24px auto',
                    borderRadius: 16,
                    background: '#ffffff',
                    boxShadow: '0 18px 40px rgba(15,23,42,0.16)',
                    overflow: 'hidden'
                }}
            >
                <CanvasGrid gridSize={gridSize} />

                {elements.map((el) => (
                    <DraggableElement
                        key={el.id}
                        projectId={projectId}
                        pageId={pageId}
                        element={el}
                        selected={el.id === selectedId}
                        onSelect={() => handleSelect(el.id)}
                        onDragCompute={onDragCompute}
                        maxZ={maxZ}
                    />
                ))}
            </div>
        </div>
    );
}
