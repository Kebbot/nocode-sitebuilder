// backend/src/routes/pages.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    listPages,
    createPage,
    deletePage
} from '../controllers/page.controller.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

// GET /api/projects/:projectId/pages
router.get('/', listPages);

// POST /api/projects/:projectId/pages
router.post('/', createPage);

// DELETE /api/projects/:projectId/pages/:pageId
router.delete('/:pageId', deletePage);

export default router;
