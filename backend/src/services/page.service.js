import { Page } from '../models/Page.js';
import slugify from 'slugify';

export const listPages = (projectId, userProjectGuard) =>
    Page.findAll({ where: { projectId }, order: [['order', 'ASC']] });

export const createPage = async (project, data) => {
    let { name, slug, meta, order } = data;
    if (!slug) slug = slugify(name, { lower: true, strict: true });
    const exists = await Page.findOne({ where: { projectId: project.id, slug } });
    if (exists) throw new Error('Slug already exists in this project');
    return Page.create({ projectId: project.id, name, slug, meta: meta || {}, order: order || 0 });
};

export const getPage = async (project, pageId) => {
    const page = await Page.findOne({ where: { id: pageId, projectId: project.id } });
    if (!page) throw new Error('Page not found');
    return page;
};

export const updatePage = async (project, pageId, patch) => {
    const page = await getPage(project, pageId);
    if (patch.slug && patch.slug !== page.slug) {
        const exists = await Page.findOne({ where: { projectId: project.id, slug: patch.slug } });
        if (exists) throw new Error('Slug already exists in this project');
    }
    await page.update(patch);
    return page;
};

export const removePage = async (project, pageId) => {
    const page = await getPage(project, pageId);
    await page.destroy();
    return true;
};