// backend/src/models/Element.js
import { DataTypes, Model } from 'sequelize';

export default class Element extends Model {
    static initModel(sequelize) {
        Element.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                pageId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                // Тип блока: Heading | Text | Button | Image | ZeroBlock | ...
                type: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                // Абсолютное позиционирование на Canvas
                x: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                y: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                width: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 100,
                },
                height: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 40,
                },
                zIndex: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
                // Стили элемента (фон, цвет, радиус и т.д.)
                styles: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                    defaultValue: {},
                },
                // Атрибуты элемента (текст, src у картинки и т.п.)
                attrs: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                    defaultValue: {},
                },
            },
            {
                sequelize,
                modelName: 'Element',
                tableName: 'elements',
                underscored: false,
                timestamps: true,
                indexes: [
                    { fields: ['pageId'] },
                    { fields: ['type'] },
                    { fields: ['zIndex'] },
                ],
            }
        );
        return Element;
    }
}