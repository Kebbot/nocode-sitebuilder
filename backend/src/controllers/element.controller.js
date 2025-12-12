// backend/src/controllers/element.controller.js
import Element from '../models/Element.js';
import Page from '../models/Page.js';
import Project from '../models/Project.js';

async function ensurePageOwnedByUser({ userId, projectId, pageId }) {
    const project = await Project.findOne({ where: { id: projectId, userId } });
    if (!project) return null;

    const page = await Page.findOne({ where: { id: pageId, projectId } });
    if (!page) return null;

    return { project, page };
}

// GET /api/projects/:projectId/pages/:pageId/elements
export async function listElements(req, res, next) {
    try {
        const userId = req.userId;
        const projectId = Number(req.params.projectId);
        const pageId = Number(req.params.pageId);

        if (!projectId || !pageId) {
            return res.status(400).json({ error: 'projectId and pageId are required' });
        }

        const owned = await ensurePageOwnedByUser({ userId, projectId, pageId });
        if (!owned) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const elements = await Element.findAll({
            where: { pageId },
            order: [['zIndex', 'ASC'], ['id', 'ASC']]
        });

        return res.json({ elements });
    } catch (err) {
        next(err);
    }
}

// POST /api/projects/:projectId/pages/:pageId/elements
export async function createElement(req, res, next) {
    try {
        const userId = req.userId;
        const projectId = Number(req.params.projectId);
        const pageId = Number(req.params.pageId);

        const {
            type,
            x = 40,
            y = 40,
            width = 200,
            height = 60,
            attrs = {},
            styles = {},
            zIndex = 0
        } = req.body || {};

        if (!projectId || !pageId) {
            return res.status(400).json({ error: 'projectId and pageId are required' });
        }
        if (!type || typeof type !== 'string') {
            return res.status(400).json({ error: 'type is required' });
        }

        const owned = await ensurePageOwnedByUser({ userId, projectId, pageId });
        if (!owned) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const element = await Element.create({
            pageId,
            type,
            x,
            y,
            width,
            height,
            attrs,
            styles,
            zIndex
        });

        return res.status(201).json({ element });
    } catch (err) {
        next(err);
    }
}

// PATCH /api/projects/:projectId/pages/:pageId/elements/:elementId
export async function updateElement(req, res, next) {
    try {
        const userId = req.userId;
        const projectId = Number(req.params.projectId);
        const pageId = Number(req.params.pageId);
        const elementId = Number(req.params.elementId);
        const patch = req.body || {};

        if (!projectId || !pageId || !elementId) {
            return res.status(400).json({ error: 'projectId, pageId and elementId are required' });
        }

        const owned = await ensurePageOwnedByUser({ userId, projectId, pageId });
        if (!owned) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const element = await Element.findOne({ where: { id: elementId, pageId } });
        if (!element) {
            return res.status(404).json({ error: 'Element not found' });
        }

        const allowedFields = ['x', 'y', 'width', 'height', 'zIndex', 'attrs', 'styles', 'type'];
        const updateData = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(patch, key)) {
                updateData[key] = patch[key];
            }
        }

        await element.update(updateData);

        return res.json({ element });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/projects/:projectId/pages/:pageId/elements/:elementId
export async function deleteElement(req, res, next) {
    try {
        const userId = req.userId;
        const projectId = Number(req.params.projectId);
        const pageId = Number(req.params.pageId);
        const elementId = Number(req.params.elementId);

        if (!projectId || !pageId || !elementId) {
            return res.status(400).json({ error: 'projectId, pageId and elementId are required' });
        }

        const owned = await ensurePageOwnedByUser({ userId, projectId, pageId });
        if (!owned) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const element = await Element.findOne({ where: { id: elementId, pageId } });
        if (!element) {
            return res.status(404).json({ error: 'Element not found' });
        }

        await element.destroy();

        return res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

export default {
    listElements,
    createElement,
    updateElement,
    deleteElement
};
