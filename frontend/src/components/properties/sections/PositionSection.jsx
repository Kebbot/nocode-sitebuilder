import React from 'react';

export default function PositionSection({ value, onChange }) {
    const [local, setLocal] = React.useState({
        x: value.x ?? 0,
        y: value.y ?? 0,
        width: value.width ?? 200,
        height: value.height ?? 80,
        zIndex: value.zIndex ?? 0
    });

    React.useEffect(() => {
        setLocal({
            x: value.x ?? 0,
            y: value.y ?? 0,
            width: value.width ?? 200,
            height: value.height ?? 80,
            zIndex: value.zIndex ?? 0
        });
    }, [value.id, value.x, value.y, value.width, value.height, value.zIndex]);

    const updateField = (field, raw) => {
        const num = Number.isNaN(Number(raw)) ? 0 : Number(raw);
        const next = { ...local, [field]: num };
        setLocal(next);
        if (onChange) {
            onChange({ [field]: num });
        }
    };

    const handleChange = (field) => (e) => updateField(field, e.target.value);

    return (
        <Section title="Позиция и размеры">
            {/* X, Y, ширина, высота — сеткой 2x2 */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 8,
                    marginBottom: 8
                }}
            >
                <Field label="X">
                    <input
                        type="number"
                        value={local.x}
                        onChange={handleChange('x')}
                        style={inputStyle}
                    />
                </Field>
                <Field label="Y">
                    <input
                        type="number"
                        value={local.y}
                        onChange={handleChange('y')}
                        style={inputStyle}
                    />
                </Field>
                <Field label="Ширина">
                    <input
                        type="number"
                        value={local.width}
                        onChange={handleChange('width')}
                        style={inputStyle}
                    />
                </Field>
                <Field label="Высота">
                    <input
                        type="number"
                        value={local.height}
                        onChange={handleChange('height')}
                        style={inputStyle}
                    />
                </Field>
            </div>

            {/* Z — отдельной строкой, чтобы ничего не наезжало */}
            <div style={{ marginBottom: 6 }}>
                <Field label="Z (слой)">
                    <input
                        type="number"
                        value={local.zIndex}
                        onChange={handleChange('zIndex')}
                        style={inputStyle}
                    />
                </Field>
            </div>

            <small style={{ fontSize: 11, color: '#9ca3af' }}>
                Координаты и размеры соответствуют значению на канвасе.
            </small>
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
