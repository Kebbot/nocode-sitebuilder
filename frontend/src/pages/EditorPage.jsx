// frontend/src/pages/EditorPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Topbar from '../components/layout/Topbar.jsx';
import LeftPanel from '../components/layout/LeftPanel.jsx';
import RightPanel from '../components/layout/RightPanel.jsx';
import CanvasArea from '../components/layout/CanvasArea.jsx';
import { useListElementsQuery } from '../features/elements/elementsApi.js';
import { DndContext } from '@dnd-kit/core';

export default function EditorPage() {
    const { projectId, pageId } = useParams();
    const { leftOpen, rightOpen } = useSelector((s) => s.ui);
    const { data: elements = [] } = useListElementsQuery({ projectId, pageId });

    // вычисляем колонки в зависимости от открытых панелей
    let columns = '';
    if (leftOpen && rightOpen) {
        columns = '320px 1fr 360px';
    } else if (leftOpen && !rightOpen) {
        columns = '320px 1fr';
    } else if (!leftOpen && rightOpen) {
        columns = '1fr 360px';
    } else {
        columns = '1fr';
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: '56px 1fr',
                height: '100vh'
            }}
        >
            <Topbar projectId={projectId} pageId={pageId} />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: columns,
                    minHeight: 0
                }}
            >
                {leftOpen && (
                    <LeftPanel projectId={projectId} pageId={pageId} />
                )}

                <DndContext>
                    <CanvasArea
                        projectId={projectId}
                        pageId={pageId}
                        elements={elements}
                    />
                </DndContext>

                {rightOpen && (
                    <RightPanel projectId={projectId} pageId={pageId} />
                )}
            </div>
        </div>
    );
}
