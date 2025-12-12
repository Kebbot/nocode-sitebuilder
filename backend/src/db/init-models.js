// backend/src/db/init-models.js
import User from '../models/User.js';
import Project from '../models/Project.js';
import Page from '../models/Page.js';
import Element from '../models/Element.js';

export default function initModels(sequelize) {
    // Инициализация таблиц
    User.initModel(sequelize);
    Project.initModel(sequelize);
    Page.initModel(sequelize);
    Element.initModel(sequelize);

    // Ассоциации
    User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Project.belongsTo(User, { foreignKey: 'userId' });

    Project.hasMany(Page, { foreignKey: 'projectId', onDelete: 'CASCADE' });
    Page.belongsTo(Project, { foreignKey: 'projectId' });

    Page.hasMany(Element, { foreignKey: 'pageId', onDelete: 'CASCADE' });
    Element.belongsTo(Page, { foreignKey: 'pageId' });

    return { User, Project, Page, Element };
}
