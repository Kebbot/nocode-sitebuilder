// backend/src/config/database.js
import { env } from './env.js';

export default {
    development: {
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres'
    },
    test: {
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres',
        logging: false
    },
    production: {
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres',
        logging: false
    }
};