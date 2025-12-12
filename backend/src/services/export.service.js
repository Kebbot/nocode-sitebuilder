// backend/src/services/export.service.js
import archiver from 'archiver';
import Project from '../models/Project.js';
import Page from '../models/Page.js';
import Element from '../models/Element.js';

// ---------- helpers ----------

function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function styleObjToInline(styles = {}) {
    const map = {
        bg: 'background',
        color: 'color',
        radius: 'border-radius',
        width: 'width',
        height: 'height',
        padding: 'padding',
        margin: 'margin',
        display: 'display',
        placeItems: 'place-items',
        fontSize: 'font-size',
        fontWeight: 'font-weight',
        textAlign: 'text-align',
        border: 'border',
        boxShadow: 'box-shadow',
        opacity: 'opacity',
        transform: 'transform'
    };

    const out = [];
    for (const [key, value] of Object.entries(styles || {})) {
        if (value === undefined || value === null || value === '') continue;
        const prop =
            map[key] || key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
        out.push(`${prop}:${value}`);
    }
    return out.join(';');
}

// базовый CSS, который кладём в styles.css
function buildCss() {
    return `/* Base layout */
html,body{
  margin:0;
  padding:0;
  font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
}
body{
  background:#f3f4f6;
  color:#111827;
}
.site-header{
  background:#0f172a;
  color:#e5e7eb;
  padding:12px 24px;
  box-shadow:0 10px 25px rgba(15,23,42,0.35);
}
.nav{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.nav a{
  text-decoration:none;
  color:#e5e7eb;
  font-size:14px;
  padding:6px 10px;
  border-radius:999px;
  border:1px solid rgba(148,163,184,0.5);
}
.nav a.active{
  background:#e5e7eb;
  color:#0f172a;
}
.stage-wrapper{
  display:flex;
  justify-content:center;
  padding:40px 16px;
}
.stage{
  position:relative;
  width:100%; /* было 1200px*/
  height:auto; /* 800px будет переопределено inline-стилем в index.html */
  background:#f9fafb;
  border-radius:16px;
  box-shadow:0 18px 40px rgba(15,23,42,0.16);
  overflow:visible;
}
.el-block{
  position:absolute;
  box-sizing:border-box;
  background:#ffffff;
  border-radius:16px;
  box-shadow:0 10px 30px rgba(15,23,42,0.12);
  display:flex;
  align-items:center;
  padding:16px 24px;
}
.el-block h1,
.el-block p{
  margin:0;
}
.el-block button{
  border:0;
  border-radius:999px;
  padding:10px 18px;
  cursor:pointer;
}

/* ссылка-кнопка в экспортированном HTML, чтобы выглядела как кнопка */
.el-block a.btn-link{
  border:0;
  border-radius:999px;
  padding:10px 18px;
  cursor:pointer;
  text-decoration:none;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  color:inherit;
}
`;
}

// рендер одного элемента в HTML
function renderElement(el = {}) {
    const type = el.type || 'ZeroBlock';
    const styles = el.styles || {};
    const attrs = el.attrs || {};

    const x = el.x ?? 0;
    const y = el.y ?? 0;
    const width = el.width ?? 400;
    const height = el.height ?? 80;

    // позиционирование как на канвасе
    const basePos = `left:${x}px;top:${y}px;width:${width}px;height:${height}px;`;
    const styleInline = styleObjToInline(styles);
    const fullStyle = basePos + (styleInline ? styleInline + ';' : '');

    let inner = '';

    switch (type) {
        case 'Heading':
            inner = `<h1>${escapeHtml(
                attrs.text ?? 'Заголовок страницы'
            )}</h1>`;
            break;
        case 'Text':
            inner = `<p>${escapeHtml(attrs.text ?? 'Абзац текста')}</p>`;
            break;
        case 'Button': {
            // 🔹 тут новая логика: если есть href — рендерим ссылку
            const label = escapeHtml(attrs.text ?? 'Кнопка');
            const href = attrs.href ? escapeHtml(attrs.href) : null;

            if (href) {
                inner = `<a href="${href}" class="btn-link">${label}</a>`;
            } else {
                inner = `<button type="button">${label}</button>`;
            }
            break;
        }
        case 'Image': {
            const src = attrs.src || '';
            const alt = escapeHtml(attrs.alt || '');
            inner = src
                ? `<img src="${src}" alt="${alt}" style="max-width:100%;max-height:100%;border-radius:inherit;" />`
                : `<p style="color:#6b7280;">Image</p>`;
            break;
        }
        case 'ZeroBlock':
        default:
            inner = '';
    }

    return `<div class="el-block" style="${fullStyle}">${inner}</div>`;
}

// ---------- нормализация данных проекта ----------

function normalizeProject(projectInstance) {
    const plain = projectInstance.get({ plain: true });

    const rawPages = plain.Pages || plain.pages || [];
    const pages = rawPages
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((p, index) => {
            const rawElements = p.Elements || p.elements || [];
            const elements = rawElements
                .slice()
                .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
                .map((e) => ({
                    id: e.id,
                    type: e.type,
                    x: e.x ?? 0,
                    y: e.y ?? 0,
                    width: e.width ?? 200,
                    height: e.height ?? 80,
                    styles: e.styles || {},
                    attrs: e.attrs || {}
                }));

            return {
                id: p.id,
                name: p.name || `Страница ${index + 1}`,
                slug: p.slug || null,
                elements
            };
        });

    return {
        id: plain.id,
        name: plain.name,
        pages
    };
}

// ---------- HTML для одной страницы ----------

function buildPageHtml(project, page, pages, fileMap, canvasHeight) {
    const elements = page.elements || [];
    const elementsHtml = elements.map(renderElement).join('\n      ');

    const title =
        (project.name ? `${project.name} — ` : '') +
        (page.name || 'Страница');

    const navHtml = pages
        .map((p) => {
            const href = fileMap[p.id] || 'index.html';
            const label = p.name || `Страница ${p.id}`;
            const active = p.id === page.id;
            return `<a href="${href}" class="${active ? 'active' : ''
                }">${escapeHtml(label)}</a>`;
        })
        .join('\n      ');

    const inlineStageHeight = `<style>.stage{height:${canvasHeight}px;}</style>`;

    return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="styles.css" />
  ${inlineStageHeight}
</head>
<body>
  <header class="site-header">
    <nav class="nav">
      ${navHtml}
    </nav>
  </header>
  <div class="stage-wrapper">
    <div class="stage">
      ${elementsHtml}
    </div>
  </div>
</body>
</html>`;
}

// ---------- ZIP export ----------

export async function exportProjectZip(userId, projectId, res) {
    const project = await Project.findOne({
        where: { id: projectId, userId },
        include: [
            {
                model: Page,
                include: [Element]
            }
        ]
    });

    if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
    }

    const snapshot = normalizeProject(project);
    let pages = snapshot.pages;

    // если страниц нет — делаем одну пустую
    if (!pages || pages.length === 0) {
        pages = [
            {
                id: 1,
                name: 'Главная',
                slug: 'index',
                elements: []
            }
        ];
    }

    // решаем, какие имена файлов будут у страниц
    const fileMap = {};
    let indexAssigned = false;

    pages.forEach((p, idx) => {
        let fileName;

        const rawSlug = (p.slug || '')
            .toString()
            .trim()
            .replace(/\.html?$/i, '')
            .replace(/[^a-zA-Z0-9_-]/g, '-');

        if (!indexAssigned) {
            // первая страница или та, что явно index
            if (rawSlug === 'index' || idx === 0) {
                fileName = 'index.html';
                indexAssigned = true;
            }
        }

        if (!fileName) {
            fileName = rawSlug ? `${rawSlug}.html` : `page-${p.id}.html`;
        }

        fileMap[p.id] = fileName;
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename="project-${projectId}.zip"`
    );

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
        console.error('Archive error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to create archive' });
        }
    });

    archive.pipe(res);

    // общий CSS
    const css = buildCss();
    archive.append(css, { name: 'styles.css' });

    // для каждой страницы считаем нужную высоту полотна
    for (const page of pages) {
        const elements = page.elements || [];
        const maxBottom = elements.reduce((acc, el) => {
            const bottom = (el.y ?? 0) + (el.height ?? 80);
            return bottom > acc ? bottom : acc;
        }, 0);
        const canvasHeight = Math.max(800, maxBottom + 160);

        const html = buildPageHtml(snapshot, page, pages, fileMap, canvasHeight);
        const fileName = fileMap[page.id] || 'index.html';
        archive.append(html, { name: fileName });
    }

    // на будущее — папка assets/
    archive.append('', { name: 'assets/.keep' });

    await archive.finalize();
}

export default {
    exportProjectZip
};
