// backend/src/routes/elements.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    listElements,
    createElement,
    updateElement,
    deleteElement
} from '../controllers/element.controller.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', listElements);
router.post('/', createElement);
router.patch('/:elementId', updateElement);
router.delete('/:elementId', deleteElement);

export default router;
