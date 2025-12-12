// frontend/src/components/canvas/DraggableElement.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useUpdateElementMutation } from '../../features/elements/elementsApi.js';
import { blockRegistry } from '../../utils/blockRegistry.jsx';

export default function DraggableElement({
    projectId,
    pageId,
    element,
    selected,
    onSelect,
    onDragCompute,
    maxZ = 0
}) {
    const [updateElement] = useUpdateElementMutation();

    const [pos, setPos] = useState({ x: element.x, y: element.y });
    const posRef = useRef({ x: element.x, y: element.y });
    const [dragging, setDragging] = useState(false);
    const [z, setZ] = useState(
        typeof element.zIndex === 'number' ? element.zIndex : 0
    );

    // синхронизация, если элемент обновился с сервера
    useEffect(() => {
        if (!dragging) {
            const next = { x: element.x, y: element.y };
            setPos(next);
            posRef.current = next;
            setZ(typeof element.zIndex === 'number' ? element.zIndex : 0);
        }
    }, [element.x, element.y, element.zIndex, element.id, dragging]);

    const Comp = blockRegistry[element.type]?.renderer || DefaultBlock;

    const handleMouseDown = (e) => {
        e.stopPropagation();
        onSelect && onSelect();

        // для PropertiesPanel
        window.__nsb_selected = element.id;
        window.dispatchEvent(new Event('nsb-select'));

        const start = {
            x: e.clientX,
            y: e.clientY,
            ex: posRef.current.x,
            ey: posRef.current.y
        };

        // Поднимаем элемент поверх остальных
        const nextZ = (Number.isFinite(maxZ) ? maxZ : 0) + 1;
        setZ(nextZ);
        // не ждём await, чтобы не тормозить перетаскивание
        updateElement({
            projectId,
            pageId,
            elementId: element.id,
            body: { zIndex: nextZ }
        })
            .unwrap()
            .catch((err) => {
                console.error('Не удалось обновить zIndex элемента', err);
            });

        setDragging(true);

        const handleMove = (ev) => {
            const dx = ev.clientX - start.x;
            const dy = ev.clientY - start.y;

            let nx = start.ex + dx;
            let ny = start.ey + dy;

            if (onDragCompute) {
                const snapped = onDragCompute({
                    id: element.id,
                    x: nx,
                    y: ny,
                    width: element.width,
                    height: element.height
                });
                if (snapped) {
                    nx = snapped.x;
                    ny = snapped.y;
                }
            }

            const next = { x: nx, y: ny };
            posRef.current = next;
            setPos(next);
        };

        const handleUp = async () => {
            setDragging(false);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);

            const { x, y } = posRef.current;
            try {
                await updateElement({
                    projectId,
                    pageId,
                    elementId: element.id,
                    body: { x, y }
                }).unwrap();
            } catch (err) {
                console.error('Не удалось сохранить позицию элемента', err);
            }
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: element.width,
                height: element.height,
                zIndex: z,
                outline: selected
                    ? '2px solid #4f7cff'
                    : '1px solid rgba(15,23,42,0.08)',
                borderRadius: 8,
                userSelect: 'none',
                cursor: dragging ? 'grabbing' : 'grab',
                background: 'transparent',
                display: 'grid',
                placeItems: 'stretch'
            }}
        >
            <Comp element={element} />
        </div>
    );
}

function DefaultBlock() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                background: '#e5e7eb'
            }}
        />
    );
}
