// backend/src/models/Page.js
import { DataTypes, Model } from 'sequelize';

export default class Page extends Model {
    static initModel(sequelize) {
        Page.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                projectId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                // ЧПУ/путь страницы (например, '/', '/about')
                path: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    defaultValue: '/',
                },
                // Порядок сортировки страниц в навигации
                sortOrder: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                // Опциональные настройки страницы
                settings: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                    defaultValue: {},
                },
            },
            {
                sequelize,
                modelName: 'Page',
                tableName: 'pages',
                underscored: false,
                timestamps: true,
                indexes: [
                    { fields: ['projectId'] },
                    // уникальность пути в рамках проекта
                    { unique: true, fields: ['projectId', 'path'] },
                ],
            }
        );
        return Page;
    }
}