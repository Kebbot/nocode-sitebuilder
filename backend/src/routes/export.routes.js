// backend/src/routes/export.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { exportProject } from '../controllers/export.controller.js';

const router = Router();

// GET /api/export/project/:projectId.zip
router.get('/project/:projectId.zip', requireAuth, exportProject);

export default router;
