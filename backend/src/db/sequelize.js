
import { Sequelize } from 'sequelize';

const {
    DB_HOST = 'postgres',
    DB_PORT = '5432',
    DB_NAME = 'nsb',
    DB_USER = 'nsb',
    DB_PASSWORD = 'nsb'
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false
});

export default sequelize;