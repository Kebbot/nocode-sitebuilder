import { Router } from 'express';
import { createProject, listProjects } from '../controllers/project.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', listProjects);
router.post('/', createProject);

export default router;