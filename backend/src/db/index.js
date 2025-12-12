import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';
import './init-models.js';

export const sequelize = new Sequelize(
    env.db.database,
    env.db.username,
    env.db.password,
    {
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres',
        logging: env.nodeEnv === 'development' ? console.log : false
    }
);

export const connectDB = async () => {
    await sequelize.authenticate();
    if (env.autoSync) {
        // гарантируем таблицы; без alter, чтобы не ломать схему в проде
        await sequelize.sync();
    }
};