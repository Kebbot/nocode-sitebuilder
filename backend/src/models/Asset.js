import { DataTypes, Model } from 'sequelize';

export class Asset extends Model {
    static initModel(sequelize) {
        Asset.init(
            {
                id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
                userId: { type: DataTypes.UUID, allowNull: false },
                projectId: { type: DataTypes.UUID, allowNull: true },
                filename: { type: DataTypes.STRING(300), allowNull: false },
                mime: { type: DataTypes.STRING(120), allowNull: false },
                size: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                url: { type: DataTypes.STRING(500), allowNull: false } // /uploads/<file>
            },
            { sequelize, tableName: 'assets', underscored: true }
        );
        return Asset;
    }
}