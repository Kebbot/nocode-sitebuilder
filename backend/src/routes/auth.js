// backend/src/routes/auth.js
import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Публичные эндпоинты
router.post('/register', register);
router.post('/login', login);

// Требует JWT
router.get('/me', requireAuth, me);

export default router;
