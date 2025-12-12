// frontend/src/components/properties/sections/TechnicalSection.jsx
import React from 'react';

export default function TechnicalSection({ value, onChange }) {
    const attrs = value.attrs || {};

    const [local, setLocal] = React.useState({
        id: attrs.id || '',
        className: attrs.class || '',
        text: resolveInitialText(value.type, attrs),
        href: attrs.href || '',
        src: attrs.src || '',
        alt: attrs.alt || ''
    });

    React.useEffect(() => {
        const a = value.attrs || {};
        setLocal({
            id: a.id || '',
            className: a.class || '',
            text: resolveInitialText(value.type, a),
            href: a.href || '',
            src: a.src || '',
            alt: a.alt || ''
        });
    }, [value.id, value.type]);

    const patch = (key, val) => {
        const next = { ...local, [key]: val };
        setLocal(next);

        if (!onChange) return;

        switch (key) {
            case 'className':
                onChange({ class: val });
                break;
            case 'id':
                onChange({ id: val });
                break;
            case 'text':
                onChange({ text: val });
                break;
            case 'href':
                onChange({ href: val });
                break;
            case 'src':
                onChange({ src: val });
                break;
            case 'alt':
                onChange({ alt: val });
                break;
            default:
                break;
        }
    };

    const isTextLike =
        value.type === 'Heading' ||
        value.type === 'Text' ||
        value.type === 'Button';

    const isImage = value.type === 'Image';

    return (
        <Section title="Технические свойства">
            {/* ID */}
            <Field label="ID">
                <input
                    value={local.id}
                    onChange={(e) => patch('id', e.target.value)}
                    style={inputStyle}
                    placeholder="Опциональный ID элемента"
                />
            </Field>

            {/* CSS-классы */}
            <Field label="CSS-классы">
                <input
                    value={local.className}
                    onChange={(e) => patch('className', e.target.value)}
                    style={inputStyle}
                    placeholder="Напр.: hero-title primary"
                />
            </Field>

            {/* Текст для Heading/Text/Button */}
            {isTextLike && (
                <Field label="Текст">
                    <textarea
                        value={local.text}
                        onChange={(e) => patch('text', e.target.value)}
                        style={{
                            ...inputStyle,
                            resize: 'vertical',
                            minHeight: 60
                        }}
                    />
                </Field>
            )}

            {/* Ссылка для кнопки */}
            {value.type === 'Button' && (
                <Field label="Ссылка (href)">
                    <input
                        value={local.href}
                        onChange={(e) => patch('href', e.target.value)}
                        style={inputStyle}
                        placeholder="https://example.com"
                    />
                </Field>
            )}

            {/* Свойства изображения */}
            {isImage && (
                <>
                    <Field label="URL изображения (src)">
                        <input
                            value={local.src}
                            onChange={(e) => patch('src', e.target.value)}
                            style={inputStyle}
                            placeholder="https://example.com/image.png"
                        />
                    </Field>
                    <Field label="Alt-текст">
                        <input
                            value={local.alt}
                            onChange={(e) => patch('alt', e.target.value)}
                            style={inputStyle}
                            placeholder="Описание для SEO и доступности"
                        />
                    </Field>
                </>
            )}
        </Section>
    );
}

function resolveInitialText(type, attrs) {
    if (attrs.text) return attrs.text;
    if (type === 'Heading') return 'Заголовок';
    if (type === 'Text') return 'Текст';
    if (type === 'Button') return 'Кнопка';
    return '';
}

function Section({ title, children }) {
    return (
        <div
            style={{
                padding: 10,
                borderRadius: 12,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 10px rgba(15,23,42,0.04)'
            }}
        >
            <div
                style={{
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 8,
                    color: '#6b7280'
                }}
            >
                {title}
            </div>
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label
            style={{
                display: 'grid',
                gap: 4,
                fontSize: 11,
                color: '#6b7280',
                marginBottom: 8
            }}
        >
            <span>{label}</span>
            {children}
        </label>
    );
}

const inputStyle = {
    padding: '6px 8px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    fontSize: 12,
    width: '100%',
    boxSizing: 'border-box'
};
