import React from 'react';
import { blockRegistry } from '../../utils/blockRegistry.jsx';
import { useCreateElementMutation } from '../../features/elements/elementsApi.js';

const metaByType = {
    Heading: {
        label: 'Заголовок',
        description: 'Крупный текст для секций',
        emoji: '🅷'
    },
    Text: {
        label: 'Текст',
        description: 'Абзац описания',
        emoji: '🅿️'
    },
    Button: {
        label: 'Кнопка',
        description: 'CTA / переход по ссылке',
        emoji: '🔘'
    },
    Image: {
        label: 'Изображение',
        description: 'Картинка или иллюстрация',
        emoji: '🖼️'
    },
    ZeroBlock: {
        label: 'Пустой блок',
        description: 'Свободное полотно для дизайна',
        emoji: '➕'
    }
};

export default function BlockLibrary({ projectId, pageId }) {
    const [createElement, { isLoading }] = useCreateElementMutation();

    const handleAdd = async (type) => {
        if (!projectId || !pageId) return;
        const def = blockRegistry[type]?.defaults || {};
        try {
            await createElement({
                projectId,
                pageId,
                body: {
                    type,
                    x: 40,
                    y: 40,
                    width: def.width ?? 240,
                    height: def.height ?? 80,
                    attrs: def.attrs ?? {},
                    styles: def.styles ?? {}
                }
            }).unwrap();
        } catch (e) {
            console.error('Не удалось создать элемент', e);
            alert('Не удалось создать элемент');
        }
    };

    const keys = Object.keys(blockRegistry || {});

    if (!keys.length) {
        return (
            <div style={{ fontSize: 13, color: '#9ca3af' }}>
                Библиотека блоков пока пуста.
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}
        >
            {keys.map((key) => {
                const meta = metaByType[key] || {
                    label: key,
                    description: '',
                    emoji: '⬜'
                };
                return (
                    <button
                        key={key}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleAdd(key)}
                        style={buttonStyle}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 999,
                                background: '#eef2ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                flexShrink: 0
                            }}
                        >
                            {meta.emoji}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 2,
                                flex: 1
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#111827'
                                }}
                            >
                                {meta.label}
                            </span>
                            {meta.description && (
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: '#6b7280'
                                    }}
                                >
                                    {meta.description}
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

const buttonStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    cursor: 'pointer',
    font: 'inherit',
    textAlign: 'left',
    transition:
        'box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease',
    boxShadow: '0 1px 2px rgba(15,23,42,0.03)'
};
