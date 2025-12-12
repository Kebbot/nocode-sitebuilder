import React from 'react';

const STYLE_PRESETS = [
    {
        id: 'card',
        name: 'Карточка',
        desc: 'Белый фон, мягкая тень',
        patch: {
            bg: '#ffffff',
            color: '#111827',
            radius: 16,
            padding: '16px 24px',
            boxShadow: '0 18px 36px rgba(15,23,42,0.14)',
            border: '1px solid rgba(148,163,184,0.18)',
            opacity: 1
        }
    },
    {
        id: 'soft',
        name: 'Soft',
        desc: 'Серый фон, без жесткой тени',
        patch: {
            bg: '#f3f4f6',
            color: '#111827',
            radius: 20,
            padding: '16px 22px',
            boxShadow: '0 10px 24px rgba(15,23,42,0.10)',
            border: '1px solid rgba(148,163,184,0.35)',
            opacity: 1
        }
    },
    {
        id: 'dark',
        name: 'Dark',
        desc: 'Темный блок для hero / футера',
        patch: {
            bg: '#020617',
            color: '#e5e7eb',
            radius: 24,
            padding: '18px 24px',
            boxShadow: '0 22px 45px rgba(15,23,42,0.55)',
            border: '1px solid rgba(148,163,184,0.35)',
            opacity: 1
        }
    },
    {
        id: 'glass',
        name: 'Glass',
        desc: 'Полупрозрачное стекло',
        patch: {
            bg: 'rgba(15,23,42,0.18)',
            color: '#f9fafb',
            radius: 20,
            padding: '14px 20px',
            boxShadow: '0 26px 60px rgba(15,23,42,0.55)',
            border: '1px solid rgba(148,163,184,0.65)',
            opacity: 0.96
        }
    },
    {
        id: 'gradient',
        name: 'Градиент',
        desc: 'Яркая подложка для заголовков',
        patch: {
            bg:
                'linear-gradient(135deg, #4f46e5 0%, #22c55e 45%, #fb923c 100%)',
            color: '#f9fafb',
            radius: 24,
            padding: '18px 26px',
            boxShadow: '0 24px 50px rgba(15,23,42,0.55)',
            border: 'none',
            opacity: 1
        }
    },
    {
        id: 'minimal',
        name: 'Минимал',
        desc: 'Без фона и теней',
        patch: {
            bg: 'transparent',
            color: '#111827',
            radius: 0,
            padding: '0',
            boxShadow: 'none',
            border: 'none',
            opacity: 1
        }
    }
];

function normalizeNumber(v, fallback) {
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    const n = parseFloat(v);
    return Number.isNaN(n) ? fallback : n;
}

export default function DesignSection({ value, onChange }) {
    const styles = value.styles || {};

    const [local, setLocal] = React.useState({
        bg: styles.bg ?? '#ffffff',
        color: styles.color ?? '#111827',
        radius: normalizeNumber(styles.radius, 12),
        padding: styles.padding ?? '16px 20px',
        fontSize: normalizeNumber(styles.fontSize, 16),
        fontWeight: normalizeNumber(styles.fontWeight, 500),
        textAlign: styles.textAlign ?? 'left',
        border: styles.border ?? '',
        boxShadow: styles.boxShadow ?? '',
        opacity:
            typeof styles.opacity === 'number' && !Number.isNaN(styles.opacity)
                ? styles.opacity
                : 1
    });

    // синхронизация при смене выделенного элемента
    React.useEffect(() => {
        const s = value.styles || {};
        setLocal({
            bg: s.bg ?? '#ffffff',
            color: s.color ?? '#111827',
            radius: normalizeNumber(s.radius, 12),
            padding: s.padding ?? '16px 20px',
            fontSize: normalizeNumber(s.fontSize, 16),
            fontWeight: normalizeNumber(s.fontWeight, 500),
            textAlign: s.textAlign ?? 'left',
            border: s.border ?? '',
            boxShadow: s.boxShadow ?? '',
            opacity:
                typeof s.opacity === 'number' && !Number.isNaN(s.opacity)
                    ? s.opacity
                    : 1
        });
    }, [value.id]);

    const emitPatch = (patch) => {
        if (onChange) {
            onChange(patch);
        }
    };

    const updateString = (field, v) => {
        const next = { ...local, [field]: v };
        setLocal(next);
        emitPatch({ [field]: v });
    };

    const updateNumber = (field, raw, opts = {}) => {
        let n = parseFloat(raw);
        if (Number.isNaN(n)) n = 0;
        if (typeof opts.min === 'number') n = Math.max(opts.min, n);
        if (typeof opts.max === 'number') n = Math.min(opts.max, n);
        const next = { ...local, [field]: n };
        setLocal(next);
        emitPatch({ [field]: n });
    };

    const applyPreset = (preset) => {
        const patch = preset.patch || {};
        const merged = {
            ...local,
            ...patch
        };
        setLocal(merged);
        emitPatch(patch);
    };

    return (
        <Section title="Внешний вид">
            {/* Пресеты стилей */}
            <div style={{ marginBottom: 10 }}>
                <div
                    style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#9ca3af',
                        marginBottom: 6
                    }}
                >
                    Пресеты стилей
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                        gap: 6
                    }}
                >
                    {STYLE_PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            style={presetButtonStyle}
                        >
                            <div
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    marginBottom: 2
                                }}
                            >
                                {preset.name}
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: '#9ca3af',
                                    lineHeight: 1.3
                                }}
                            >
                                {preset.desc}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Основные параметры блока */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 8,
                    marginBottom: 8
                }}
            >
                <Field label="Фон">
                    <input
                        type="text"
                        value={local.bg}
                        onChange={(e) => updateString('bg', e.target.value)}
                        placeholder="#ffffff или gradient(...)"
                        style={inputStyle}
                    />
                </Field>
                <Field label="Цвет текста">
                    <input
                        type="text"
                        value={local.color}
                        onChange={(e) => updateString('color', e.target.value)}
                        placeholder="#111827"
                        style={inputStyle}
                    />
                </Field>

                <Field label="Скругление">
                    <input
                        type="number"
                        value={local.radius}
                        onChange={(e) =>
                            updateNumber('radius', e.target.value, {
                                min: 0,
                                max: 120
                            })
                        }
                        style={inputStyle}
                    />
                </Field>
                <Field label="Прозрачность">
                    <input
                        type="number"
                        value={local.opacity}
                        onChange={(e) =>
                            updateNumber('opacity', e.target.value, {
                                min: 0,
                                max: 1
                            })
                        }
                        step="0.05"
                        style={inputStyle}
                    />
                </Field>

                <Field label="Размер шрифта">
                    <input
                        type="number"
                        value={local.fontSize}
                        onChange={(e) =>
                            updateNumber('fontSize', e.target.value, {
                                min: 8,
                                max: 96
                            })
                        }
                        style={inputStyle}
                    />
                </Field>
                <Field label="Толщина шрифта">
                    <input
                        type="number"
                        value={local.fontWeight}
                        onChange={(e) =>
                            updateNumber('fontWeight', e.target.value, {
                                min: 100,
                                max: 900
                            })
                        }
                        step="100"
                        style={inputStyle}
                    />
                </Field>
            </div>

            {/* Выравнивание + отступы */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)',
                    gap: 8,
                    marginBottom: 8
                }}
            >
                <Field label="Выравнивание текста">
                    <select
                        value={local.textAlign}
                        onChange={(e) =>
                            updateString('textAlign', e.target.value)
                        }
                        style={{
                            ...inputStyle,
                            paddingRight: 24,
                            cursor: 'pointer'
                        }}
                    >
                        <option value="left">Слева</option>
                        <option value="center">По центру</option>
                        <option value="right">Справа</option>
                        <option value="justify">По ширине</option>
                    </select>
                </Field>
                <Field label="Внутренние отступы (CSS)">
                    <input
                        type="text"
                        value={local.padding}
                        onChange={(e) =>
                            updateString('padding', e.target.value)
                        }
                        placeholder="16px 24px"
                        style={inputStyle}
                    />
                </Field>
            </div>

            {/* Граница и тень */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(1,minmax(0,1fr))',
                    gap: 8
                }}
            >
                <Field label="Граница (CSS)">
                    <input
                        type="text"
                        value={local.border}
                        onChange={(e) => updateString('border', e.target.value)}
                        placeholder="1px solid rgba(148,163,184,0.35)"
                        style={inputStyle}
                    />
                </Field>
                <Field label="Тень (CSS)">
                    <input
                        type="text"
                        value={local.boxShadow}
                        onChange={(e) =>
                            updateString('boxShadow', e.target.value)
                        }
                        placeholder="0 18px 36px rgba(15,23,42,0.14)"
                        style={inputStyle}
                    />
                </Field>
            </div>
        </Section>
    );
}

function Section({ title, children }) {
    return (
        <div
            style={{
                padding: 10,
                borderRadius: 12,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }}
        >
            <div
                style={{
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 2,
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
                color: '#6b7280'
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

const presetButtonStyle = {
    textAlign: 'left',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    padding: '6px 8px',
    cursor: 'pointer',
    outline: 'none'
};
