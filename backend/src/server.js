// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import sequelize from './db/sequelize.js';
import initModels from './db/init-models.js';

import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import pagesRouter from './routes/pages.js';
import elementsRouter from './routes/elements.js';
import exportRouter from './routes/export.routes.js';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    })
);

// heath-check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// API
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/projects/:projectId/pages', pagesRouter);
app.use('/api/projects/:projectId/pages/:pageId/elements', elementsRouter);
app.use('/api/export', exportRouter);

// глобальный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return;
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;

async function start() {
    try {
        initModels(sequelize);
        await sequelize.authenticate();

        if (process.env.AUTO_SYNC === 'true') {
            await sequelize.sync();
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Backend on :${PORT}`);
        });
    } catch (e) {
        console.error('Startup error:', e);
        process.exit(1);
    }
}

start();
