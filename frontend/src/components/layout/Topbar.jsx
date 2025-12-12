// frontend/src/components/layout/Topbar.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    toggleLeft,
    toggleRight,
    setGridSize,
    setSnapToGrid,
    setSnapToElements
} from '../../features/ui/uiSlice.js';

import {
    useListPagesQuery,
    useCreatePageMutation,
    useDeletePageMutation
} from '../../features/pages/pagesApi.js';

import useAuth from '../../hooks/useAuth.js';

export default function Topbar({ projectId, pageId }) {
    const dispatch = useDispatch();
    const ui = useSelector((s) => s.ui);
    const { logout, user, token } = useAuth();
    const nav = useNavigate();

    // страницы текущего проекта
    const { data: pages = [] } = useListPagesQuery(projectId, {
        skip: !projectId
    });
    const [createPage] = useCreatePageMutation();
    const [deletePage] = useDeletePageMutation();

    const handleNewPage = async () => {
        if (!projectId) return;
        try {
            const baseName = `Страница ${pages.length + 1}`;
            const result = await createPage({
                projectId,
                body: { name: baseName }
            }).unwrap();
            const page = result?.page || result;
            if (page?.id) {
                nav(`/editor/${projectId}/${page.id}`);
            }
        } catch (e) {
            console.error('Ошибка создания страницы', e);
            alert('Не удалось создать страницу');
        }
    };

    const handleDeletePage = async (pageToDeleteId, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!projectId) return;

        if (pages.length <= 1) {
            alert('В проекте должна остаться хотя бы одна страница.');
            return;
        }

        if (
            !window.confirm(
                'Удалить эту страницу? Все её элементы будут удалены.'
            )
        ) {
            return;
        }

        const currentIdNum = Number(pageId);
        const deleteIdNum = Number(pageToDeleteId);

        // заранее решаем, на какую страницу перейти после удаления
        let fallbackPage = null;
        if (currentIdNum === deleteIdNum) {
            const otherPages = pages.filter(
                (p) => Number(p.id) !== deleteIdNum
            );
            if (otherPages.length > 0) {
                fallbackPage = otherPages[0];
            }
        }

        try {
            await deletePage({ projectId, pageId: pageToDeleteId }).unwrap();
            if (fallbackPage) {
                nav(`/editor/${projectId}/${fallbackPage.id}`);
            }
        } catch (eDel) {
            console.error('Ошибка удаления страницы', eDel);
            alert('Не удалось удалить страницу');
        }
    };

    const handleExport = async () => {
        if (!projectId) return;
        try {
            const res = await fetch(`/api/export/project/${projectId}.zip`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined
            });

            if (!res.ok) {
                console.error('Export failed', res.status);
                alert('Не удалось экспортировать проект');
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `project-${projectId}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Export error', e);
            alert('Ошибка экспорта проекта');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 16px',
                borderBottom: '1px solid #e5e8ec',
                background: '#fff',
                fontSize: 14
            }}
        >
            <strong style={{ marginRight: 12 }}>No-Code Editor</strong>

            <button onClick={() => nav('/dashboard')} style={btn}>
                Проекты
            </button>

            <button onClick={() => dispatch(toggleLeft())} style={btn}>
                Панель блоков
            </button>
            <button onClick={() => dispatch(toggleRight())} style={btn}>
                Свойства
            </button>

            {/* Настройки сетки */}
            <label
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginLeft: 16
                }}
            >
                Grid:
                <input
                    type="number"
                    min={2}
                    max={64}
                    value={ui.gridSize}
                    onChange={(e) =>
                        dispatch(setGridSize(Number(e.target.value) || 8))
                    }
                    style={{
                        width: 56,
                        padding: '4px 6px',
                        borderRadius: 6,
                        border: '1px solid #cfd6e4'
                    }}
                />
            </label>

            <label
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginLeft: 12
                }}
            >
                <input
                    type="checkbox"
                    checked={ui.snapToGrid}
                    onChange={(e) =>
                        dispatch(setSnapToGrid(e.target.checked))
                    }
                />
                Snap Grid
            </label>

            <label
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}
            >
                <input
                    type="checkbox"
                    checked={ui.snapToElements}
                    onChange={(e) =>
                        dispatch(setSnapToElements(e.target.checked))
                    }
                />
                Snap Elements
            </label>

            {/* Вкладки страниц */}
            {projectId && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginLeft: 20,
                        maxWidth: 600,
                        overflowX: 'auto'
                    }}
                >
                    {pages.map((p) => {
                        const active =
                            String(p.id) === String(pageId);
                        return (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() =>
                                    nav(`/editor/${projectId}/${p.id}`)
                                }
                                style={{
                                    ...pageChip,
                                    background: active
                                        ? '#111827'
                                        : '#e5e7eb',
                                    color: active ? '#fff' : '#111827'
                                }}
                            >
                                <span>
                                    {p.name || `Страница ${p.id}`}
                                </span>
                                {pages.length > 1 && (
                                    <span
                                        onClick={(e) =>
                                            handleDeletePage(p.id, e)
                                        }
                                        style={{
                                            marginLeft: 6,
                                            fontSize: 12,
                                            opacity: 0.8
                                        }}
                                    >
                                        ×
                                    </span>
                                )}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={handleNewPage}
                        style={{
                            ...pageChip,
                            background: '#4f46e5',
                            color: '#fff'
                        }}
                    >
                        +
                    </button>
                </div>
            )}

            {/* Экспорт */}
            <button
                onClick={handleExport}
                style={{
                    ...btn,
                    marginLeft: 16,
                    background: '#4f7cff',
                    color: '#fff',
                    borderColor: '#4f7cff',
                    fontWeight: 600
                }}
            >
                Экспорт в ZIP
            </button>

            {/* Пользователь */}
            <div
                style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}
            >
                <span style={{ color: '#667' }}>{user?.email}</span>
                <button
                    onClick={logout}
                    style={{
                        ...btn,
                        background: '#ffe5e5',
                        borderColor: '#f5b5b5',
                        color: '#b00020'
                    }}
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}

const btn = {
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #cfd6e4',
    background: '#f7f9fc',
    cursor: 'pointer',
    fontSize: 13
};

const pageChip = {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: 999,
    border: 'none',
    fontSize: 13,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
};
