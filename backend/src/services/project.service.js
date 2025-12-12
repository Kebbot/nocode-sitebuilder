import { Project } from '../models/Project.js';
import { Page } from '../models/Page.js';

export const listProjects = (userId) =>
    Project.findAll({ where: { userId }, order: [['created_at', 'DESC']] });

export const createProject = (userId, { name, description, settings }) =>
    Project.create({ userId, name, description: description || null, settings: settings || {} });

export const getProject = async (userId, id) => {
    const project = await Project.findOne({ where: { id, userId } });
    if (!project) throw new Error('Project not found');
    return project;
};

export const updateProject = async (userId, id, patch) => {
    const project = await getProject(userId, id);
    await project.update(patch);
    return project;
};

export const removeProject = async (userId, id) => {
    const project = await getProject(userId, id);
    await project.destroy();
    return true;
};

export const getProjectWithPages = (userId, id) =>
    Project.findOne({
        where: { id, userId },
        include: [{ model: Page, as: 'pages', order: [['order', 'ASC']] }]
    });