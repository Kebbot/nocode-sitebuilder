import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { upload } from '../utils/file.js';
import * as ctrl from '../controllers/assets.controller.js';

const r = Router();
r.use(authRequired);
r.get('/', ctrl.list);
r.post('/upload', upload.single('file'), ctrl.uploadOne);
r.delete('/:assetId', ctrl.remove);

export default r;