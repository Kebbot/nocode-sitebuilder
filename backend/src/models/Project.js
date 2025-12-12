// backend/src/models/Project.js
import { DataTypes, Model } from 'sequelize';

export default class Project extends Model {
    static initModel(sequelize) {
        Project.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                // Произвольные настройки проекта (храним как JSONB в Postgres)
                settings: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                    defaultValue: {},
                },
            },
            {
                sequelize,
                modelName: 'Project',
                tableName: 'projects',
                underscored: false,
                timestamps: true,
                indexes: [
                    { fields: ['userId'] },
                    { fields: ['name'] },
                ],
            }
        );
        return Project;
    }
}