// backend/src/models/User.js
import { DataTypes, Model } from 'sequelize';

export default class User extends Model {
    static initModel(sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                    validate: { isEmail: true },
                },
                passwordHash: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users',
                underscored: false,
                timestamps: true,
                indexes: [
                    { unique: true, fields: ['email'] },
                ],
            }
        );
        return User;
    }
}