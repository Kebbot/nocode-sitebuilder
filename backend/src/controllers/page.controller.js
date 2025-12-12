// backend/src/controllers/page.controller.js
import Page from '../models/Page.js';
import Project from '../models/Project.js';

// ---------- helpers ----------

// простой slugify: "Моя страница 1" -> "moya-stranica-1"
function slugify(input) {
  if (!input) return '';
  const raw = String(input)
    .trim()
    .toLowerCase();
  const replaced = raw
    // русские буквы можно грубо заменять, но для диплома достаточно базового варианта
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return replaced || '';
}

async function findUserProject(userId, projectIdRaw) {
  const projectId = Number(projectIdRaw);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return null;
  }
  const project = await Project.findOne({
    where: { id: projectId, userId }
  });
  return project;
}

// ---------- list pages ----------
// GET /api/projects/:projectId/pages
export async function listPages(req, res, next) {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    const project = await findUserProject(userId, projectId);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    const pages = await Page.findAll({
      where: { projectId: project.id },
      order: [['createdAt', 'ASC']]
    });

    return res.json({ pages });
  } catch (err) {
    next(err);
  }
}

// ---------- create page ----------
// POST /api/projects/:projectId/pages
// Body: { name: string, slug?: string }
export async function createPage(req, res, next) {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { name, slug } = req.body || {};

    if (!name || typeof name !== 'string') {
      return res
        .status(400)
        .json({ error: 'Поле "name" обязательно' });
    }

    const project = await findUserProject(userId, projectId);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    // Базовое значение для slug/path
    const baseForSlug =
      (slug && typeof slug === 'string' && slug.trim()) || name;

    let normalized = slugify(baseForSlug);
    if (!normalized) {
      normalized = `page-${Date.now()}`;
    }

    // Важно: path заполняем всегда, slug можем оставить как есть или как нормализованный
    const page = await Page.create({
      projectId: project.id,
      name: name.trim(),
      slug: slug && typeof slug === 'string' ? slug.trim() : normalized,
      path: normalized
    });

    return res.status(201).json({ page });
  } catch (err) {
    console.error('createPage error:', err);

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Validation error' });
    }

    next(err);
  }
}

// ---------- delete page ----------
// DELETE /api/projects/:projectId/pages/:pageId
export async function deletePage(req, res, next) {
  try {
    const userId = req.userId;
    const { projectId, pageId } = req.params;

    const project = await findUserProject(userId, projectId);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    const pageIdNum = Number(pageId);
    if (!Number.isInteger(pageIdNum) || pageIdNum <= 0) {
      return res
        .status(400)
        .json({ error: 'Некорректный идентификатор страницы' });
    }

    const page = await Page.findOne({
      where: { id: pageIdNum, projectId: project.id }
    });

    if (!page) {
      return res.status(404).json({ error: 'Страница не найдена' });
    }

    await page.destroy(); // каскадно удалятся и элементы

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export default { listPages, createPage, deletePage };
