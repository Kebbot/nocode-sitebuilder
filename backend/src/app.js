import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: `${env.maxUploadMb}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${env.maxUploadMb}mb` }));

if (!fs.existsSync(env.uploadDir)) {
    fs.mkdirSync(env.uploadDir, { recursive: true });
}
app.use('/uploads', express.static(env.uploadDir));

app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'backend', env: env.nodeEnv });
});

app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
    res.type('text').send('No-Code Site Builder API');
});

// Ошибки
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    const msg = typeof err?.message === 'string' ? err.message : 'Server error';
    res.status(400).json({ error: msg });
});

export default app;