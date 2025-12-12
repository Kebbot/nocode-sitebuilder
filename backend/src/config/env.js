import 'dotenv/config';

const required = (key, fallback = undefined) => {
    const v = process.env[key] ?? fallback;
    if (v === undefined) throw new Error(`Missing required env: ${key}`);
    return v;
};

export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    corsOrigin: required('CORS_ORIGIN', '*'),
    jwtSecret: required('JWT_SECRET'),
    uploadDir: process.env.UPLOAD_DIR ?? '/app/uploads',
    maxUploadMb: parseInt(process.env.MAX_UPLOAD_MB ?? '50', 10),
    autoSync: (process.env.AUTO_SYNC ?? 'true').toLowerCase() === 'true',
    db: {
        host: required('DB_HOST'),
        port: parseInt(required('DB_PORT'), 10),
        database: required('DB_NAME'),
        username: required('DB_USER'),
        password: required('DB_PASSWORD')
    }
};