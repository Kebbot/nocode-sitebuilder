// frontend/src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    useListProjectsQuery,
    useCreateProjectMutation,
    useDeleteProjectMutation
} from '../features/projects/projectsApi.js';

import {
    useListPagesQuery,
    useCreatePageMutation
} from '../features/pages/pagesApi.js';

export default function DashboardPage() {
    const { data: projects = [] } = useListProjectsQuery();
    const [createProject] = useCreateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();
    const [newName, setNewName] = useState('Новый проект');

    const onCreate = async () => {
        try {
            await createProject({ name: newName }).unwrap();
            // список проектов сам обновится через invalidatesTags
        } catch (e) {
            console.error('Ошибка при создании проекта', e);
            alert('Не удалось создать проект. Посмотри логи backend.');
        }
    };

    const onDeleteProject = async (id) => {
        if (!window.confirm('Удалить проект целиком (все страницы и блоки)?')) {
            return;
        }
        try {
            await deleteProject(id).unwrap();
        } catch (e) {
            console.error('Ошибка удаления проекта', e);
            alert('Не удалось удалить проект.');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>Проекты</h1>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={inputStyle}
                    placeholder="Название проекта"
                />
                <button onClick={onCreate} style={btnPrimary}>
                    Создать проект
                </button>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))',
                    gap: 16
                }}
            >
                {projects.map((p) => (
                    <ProjectCard
                        key={p.id}
                        project={p}
                        onDelete={() => onDeleteProject(p.id)}
                    />
                ))}
            </div>
        </div>
    );
}

function ProjectCard({ project, onDelete }) {
    const { data: pages = [] } = useListPagesQuery(project.id, {
        skip: !project?.id
    });
    const [createPage] = useCreatePageMutation();
    const nav = useNavigate();

    const handleOpen = async () => {
        try {
            if (pages.length > 0) {
                // уже есть страницы — открываем первую
                const first = pages[0];
                nav(`/editor/${project.id}/${first.id}`);
            } else {
                // страниц нет — создаём первую и открываем
                const result = await createPage({
                    projectId: project.id,
                    body: { name: 'Home', slug: 'index' }
                }).unwrap();

                const page = result?.page || result;
                if (!page?.id) {
                    throw new Error('Некорректный ответ createPage');
                }

                nav(`/editor/${project.id}/${page.id}`);
            }
        } catch (e) {
            console.error('Ошибка открытия/создания страницы', e);
            alert('Не удалось открыть проект. Посмотри логи backend.');
        }
    };

    return (
        <div style={cardStyle}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 6
                }}
            >
                <h3 style={{ margin: 0 }}>{project.name}</h3>
                <button
                    type="button"
                    onClick={onDelete}
                    style={btnDangerSmall}
                    title="Удалить проект"
                >
                    ×
                </button>
            </div>

            <p style={{ color: '#666', minHeight: 36, marginTop: 0 }}>
                {project.description || 'Без описания'}
            </p>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8
                }}
            >
                <button onClick={handleOpen} style={btnSecondary}>
                    Открыть
                </button>

                <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    Страниц: {pages.length}
                </span>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #cfd6e4',
    width: 260
};

const btnPrimary = {
    padding: '10px 12px',
    borderRadius: 10,
    border: 0,
    background: '#4f7cff',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
};

const btnSecondary = {
    padding: '8px 10px',
    borderRadius: 10,
    border: 0,
    background: '#121a27',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
};

const cardStyle = {
    padding: 16,
    border: '1px solid #e5e8ec',
    borderRadius: 12,
    boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
    background: '#fff'
};

const btnDangerSmall = {
    width: 24,
    height: 24,
    borderRadius: 999,
    border: 'none',
    background: '#fee2e2',
    color: '#b91c1c',
    cursor: 'pointer',
    fontSize: 16,
    lineHeight: '24px',
    padding: 0
};
