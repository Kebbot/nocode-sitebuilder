import { Router } from 'express';
import auth from './auth.routes.js';
import projects from './projects.routes.js';
import pages from './pages.routes.js';
import elements from './elements.routes.js';
import assets from './assets.routes.js';
import exportRoutes from './export.routes.js';

const r = Router();
r.use('/auth', auth);
r.use('/projects', projects);
r.use('/projects', pages); // вложенные внутри /projects
r.use('/projects', elements); // вложенные внутри /projects
r.use('/assets', assets);
r.use('/export', exportRoutes);

export default r;