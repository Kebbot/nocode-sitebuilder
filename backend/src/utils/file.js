import multer from 'multer';
import path from 'path';
import { env } from '../config/env.js';
import fs from 'fs';

if (!fs.existsSync(env.uploadDir)) fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, env.uploadDir),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: env.maxUploadMb * 1024 * 1024 }
});