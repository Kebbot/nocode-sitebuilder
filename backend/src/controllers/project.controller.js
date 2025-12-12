// backend/src/controllers/project.controller.js
import Project from '../models/Project.js';

// GET /api/projects
export async function listProjects(req, res, next) {
    try {
        const userId = req.userId;
        const { limit, offset } = req.query;

        const limitNum = Number.isFinite(Number(limit))
            ? Math.max(1, Math.min(100, Number(limit)))
            : 50;
        const offsetNum = Number.isFinite(Number(offset))
            ? Math.max(0, Number(offset))
            : 0;

        const projects = await Project.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset: offsetNum
        });

        return res.json({ projects });
    } catch (err) {
        next(err);
    }
}

// POST /api/projects
// Body: { name: string, description?: string, settings?: object }
export async function createProject(req, res, next) {
    try {
        const userId = req.userId;
        const { name, description, settings } = req.body || {};

        if (!name || typeof name !== 'string') {
            return res
                .status(400)
                .json({ error: 'Поле "name" обязательно' });
        }

        const project = await Project.create({
            userId,
            name: name.trim(),
            description: description ?? null,
            settings: settings ?? {}
        });

        return res.status(201).json({ project });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/projects/:projectId
export async function deleteProject(req, res, next) {
    try {
        const userId = req.userId;
        const { projectId } = req.params;

        const idNum = Number(projectId);
        if (!Number.isInteger(idNum) || idNum <= 0) {
            return res.status(400).json({ error: 'Некорректный идентификатор проекта' });
        }

        const project = await Project.findOne({
            where: { id: idNum, userId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }

        // благодаря onDelete: 'CASCADE' в init-models
        // удалятся связанные страницы и элементы
        await project.destroy();

        // 204 No Content — всё удалили
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export default { listProjects, createProject, deleteProject };
