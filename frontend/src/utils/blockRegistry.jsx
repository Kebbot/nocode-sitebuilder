// frontend/src/utils/blockRegistry.jsx
import React from 'react';

// ----- Рендеры блоков (как они выглядят на Canvas) -----

const Heading = ({ element }) => (
    <div
        style={{
            width: '100%',
            height: '100%',
            borderRadius: element.styles?.radius ?? 16,
            background: element.styles?.bg || '#ffffff',
            boxShadow: element.styles?.boxShadow || '0 16px 32px rgba(15,23,42,0.16)',
            padding: element.styles?.padding || '0 24px',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box'
        }}
    >
        <h1
            style={{
                margin: 0,
                fontSize: element.styles?.fontSize || 28,
                fontWeight: element.styles?.fontWeight || 700,
                color: element.styles?.color || '#111827',
                textAlign: element.styles?.textAlign || 'left',
                width: '100%'
            }}
        >
            {element.attrs?.text || 'Заголовок страницы'}
        </h1>
    </div>
);

const Text = ({ element }) => (
    <div
        style={{
            width: '100%',
            height: '100%',
            borderRadius: element.styles?.radius ?? 16,
            background: element.styles?.bg || '#ffffff',
            boxShadow: element.styles?.boxShadow || '0 10px 26px rgba(15,23,42,0.10)',
            padding: element.styles?.padding || '14px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center'
        }}
    >
        <p
            style={{
                margin: 0,
                fontSize: element.styles?.fontSize || 14,
                lineHeight: 1.6,
                color: element.styles?.color || '#111827',
                textAlign: element.styles?.textAlign || 'left'
            }}
        >
            {element.attrs?.text ||
                'Это абзац текста. Вы можете менять размер блока, шрифт, отступы и цвет в панели свойств.'}
        </p>
    </div>
);

const Button = ({ element }) => (
    <button
        type="button"
        style={{
            width: '100%',
            height: '100%',
            borderRadius: element.styles?.radius ?? 999,
            border: element.styles?.border || '0',
            background: element.styles?.bg || '#4f7cff',
            color: element.styles?.color || '#ffffff',
            fontWeight: element.styles?.fontWeight || 600,
            fontSize: element.styles?.fontSize || 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
                element.styles?.boxShadow ||
                element.styles?.shadow ||
                '0 12px 24px rgba(15, 23, 42, 0.22)',
            padding: 0
        }}
        onClick={() => {
            const href = element.attrs?.href;
            if (href) {
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        }}
    >
        {element.attrs?.text || 'Кнопка'}
    </button>
);

const ImageBlock = ({ element }) => {
    const src = element.attrs?.src;
    const alt = element.attrs?.alt || '';
    const radius = element.styles?.radius ?? 16;

    if (!src) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: radius,
                    border: '1px dashed rgba(15, 23, 42, 0.25)',
                    background:
                        'repeating-linear-gradient(45deg,#f9fafb,#f9fafb 10px,#e5e7eb 10px,#e5e7eb 20px)',
                    color: '#6b7280',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 8,
                    boxSizing: 'border-box'
                }}
            >
                Изображение
                <br />
                (укажите URL в свойствах)
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            style={{
                width: '100%',
                height: '100%',
                objectFit: element.styles?.objectFit || 'cover',
                borderRadius: radius,
                display: 'block'
            }}
        />
    );
};

/**
 * ZeroBlock — секция/фон. Пока без вложенных элементов,
 * но визуально выглядит как полноценный блок-секция.
 */
const ZeroBlock = ({ element }) => (
    <div
        style={{
            width: '100%',
            height: '100%',
            borderRadius: element.styles?.radius ?? 32,
            border: element.styles?.border || '1px dashed rgba(148, 163, 184, 0.9)',
            background:
                element.styles?.bg ||
                'radial-gradient(circle at top left,#e0f2fe,#fefce8)',
            boxShadow:
                element.styles?.boxShadow ||
                '0 26px 70px rgba(15,23,42,0.26)',
            position: 'relative',
            overflow: 'hidden',
            opacity: element.styles?.opacity ?? 1
        }}
    >
        <div
            style={{
                position: 'absolute',
                inset: 12,
                borderRadius: (element.styles?.radius ?? 32) - 8,
                border: '1px dashed rgba(148,163,184,0.45)',
                pointerEvents: 'none'
            }}
        />
        <div
            style={{
                position: 'absolute',
                top: 10,
                left: 14,
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(15,23,42,0.7)',
                color: '#e5e7eb',
                fontSize: 10,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                pointerEvents: 'none'
            }}
        >
            ZeroBlock
        </div>
    </div>
);

// ----- Регистр блоков -----

export const blockRegistry = {
    Heading: {
        label: 'Заголовок',
        category: 'Текст',
        renderer: Heading,
        defaults: {
            width: 520,
            height: 80,
            attrs: { text: 'Заголовок страницы' },
            styles: {
                bg: '#ffffff',
                color: '#111827',
                radius: 16,
                fontSize: 28,
                fontWeight: 700,
                padding: '0 24px',
                boxShadow: '0 16px 32px rgba(15,23,42,0.16)'
            }
        }
    },
    Text: {
        label: 'Абзац текста',
        category: 'Текст',
        renderer: Text,
        defaults: {
            width: 520,
            height: 140,
            attrs: {
                text:
                    'Это абзац текста. Вы можете менять размер блока, шрифт, отступы и цвет в панели свойств.'
            },
            styles: {
                bg: '#ffffff',
                color: '#111827',
                radius: 16,
                fontSize: 14,
                padding: '14px 20px',
                boxShadow: '0 10px 26px rgba(15,23,42,0.10)'
            }
        }
    },
    Button: {
        label: 'Кнопка',
        category: 'Элементы',
        renderer: Button,
        defaults: {
            width: 190,
            height: 48,
            attrs: {
                text: 'Нажми меня',
                href: ''
            },
            styles: {
                bg: '#4f7cff',
                color: '#ffffff',
                radius: 999,
                fontWeight: 600,
                boxShadow: '0 14px 30px rgba(37, 99, 235, 0.45)'
            }
        }
    },
    Image: {
        label: 'Изображение',
        category: 'Медиа',
        renderer: ImageBlock,
        defaults: {
            width: 360,
            height: 220,
            attrs: {
                src: '',
                alt: 'Изображение'
            },
            styles: {
                radius: 16,
                objectFit: 'cover'
            }
        }
    },
    ZeroBlock: {
        label: 'Пустой блок / секция',
        category: 'Технич.',
        renderer: ZeroBlock,
        defaults: {
            width: 1040,
            height: 380,
            attrs: {},
            styles: {
                radius: 32,
                bg: 'radial-gradient(circle at top left,#e0f2fe,#fefce8)',
                boxShadow: '0 26px 70px rgba(15,23,42,0.26)',
                opacity: 1
            }
        }
    }
};
