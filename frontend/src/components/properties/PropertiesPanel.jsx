import React from 'react';
import {
    useListElementsQuery,
    useUpdateElementMutation,
    useDeleteElementMutation
} from '../../features/elements/elementsApi.js';
import PositionSection from './sections/PositionSection.jsx';
import DesignSection from './sections/DesignSection.jsx';
import TechnicalSection from './sections/TechnicalSection.jsx';

export default function PropertiesPanel({ projectId, pageId }) {
    const { data: elements = [] } = useListElementsQuery(
        { projectId, pageId },
        { skip: !projectId || !pageId }
    );
    const [updateElement] = useUpdateElementMutation();
    const [deleteElement] = useDeleteElementMutation();

    const selectedId = useSelectedId();
    const selected = elements.find((e) => e.id === selectedId) || null;

    if (!selected) {
        return (
            <div style={{ padding: 16, color: '#6b7280', fontSize: 14 }}>
                Выберите элемент на канвасе
            </div>
        );
    }

    const handlePositionChange = async (patch) => {
        try {
            await updateElement({
                projectId,
                pageId,
                elementId: selected.id,
                body: patch
            }).unwrap();
        } catch (e) {
            console.error('Ошибка обновления позиции элемента', e);
        }
    };

    const handleDesignChange = async (stylePatch) => {
        const nextStyles = { ...(selected.styles || {}), ...stylePatch };
        try {
            await updateElement({
                projectId,
                pageId,
                elementId: selected.id,
                body: { styles: nextStyles }
            }).unwrap();
        } catch (e) {
            console.error('Ошибка обновления стилей элемента', e);
        }
    };

    const handleTechnicalChange = async (attrsPatch) => {
        const nextAttrs = { ...(selected.attrs || {}), ...attrsPatch };
        try {
            await updateElement({
                projectId,
                pageId,
                elementId: selected.id,
                body: { attrs: nextAttrs }
            }).unwrap();
        } catch (e) {
            console.error('Ошибка обновления технических свойств', e);
        }
    };

    const handleDelete = async () => {
        if (
            !window.confirm(
                'Удалить элемент? Это действие нельзя отменить.'
            )
        ) {
            return;
        }
        try {
            await deleteElement({
                projectId,
                pageId,
                elementId: selected.id
            }).unwrap();
            if (window.__nsb_selected === selected.id) {
                window.__nsb_selected = null;
                window.dispatchEvent(new Event('nsb-select'));
            }
        } catch (e) {
            console.error('Ошибка удаления элемента', e);
            alert('Не удалось удалить элемент');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderLeft: '1px solid #e5e7eb',
                background: '#f9fafb'
            }}
        >
            <div
                style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                }}
            >
                <div
                    style={{
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#9ca3af'
                    }}
                >
                    Свойства элемента
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {selected.type || 'Element'} #{selected.id}
                </div>
            </div>

            <div
                style={{
                    padding: 12,
                    overflowY: 'auto',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                }}
            >
                <PositionSection value={selected} onChange={handlePositionChange} />
                <DesignSection value={selected} onChange={handleDesignChange} />
                <TechnicalSection value={selected} onChange={handleTechnicalChange} />
            </div>

            <div
                style={{
                    padding: 12,
                    borderTop: '1px solid #e5e7eb',
                    background: '#ffffff'
                }}
            >
                <button
                    type="button"
                    onClick={handleDelete}
                    style={btnDanger}
                >
                    Удалить элемент
                </button>
            </div>
        </div>
    );
}

/**
 * Хук для доступа к текущему выбранному элементу.
 * Canvas при клике пишет window.__nsb_selected = element.id
 * и диспатчит событие 'nsb-select'.
 */
function useSelectedId() {
    const [v, setV] = React.useState(
        typeof window !== 'undefined' ? window.__nsb_selected || null : null
    );

    React.useEffect(() => {
        const handler = () => {
            setV(window.__nsb_selected || null);
        };
        window.addEventListener('nsb-select', handler);
        return () => window.removeEventListener('nsb-select', handler);
    }, []);

    return v;
}

const btnDanger = {
    width: '100%',
    padding: '9px 10px',
    borderRadius: 999,
    border: 'none',
    background: '#fee2e2',
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
};
