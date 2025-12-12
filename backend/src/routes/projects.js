// backend/src/routes/projects.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    createProject,
    listProjects,
    deleteProject
} from '../controllers/project.controller.js';

const router = Router();

// Все эндпоинты проектов — только для авторизованных
router.use(requireAuth);

// Список проектов текущего пользователя
// GET /api/projects
router.get('/', listProjects);

// Создание проекта
// POST /api/projects
router.post('/', createProject);

// Удаление проекта
// DELETE /api/projects/:projectId
router.delete('/:projectId', deleteProject);

export default router;
