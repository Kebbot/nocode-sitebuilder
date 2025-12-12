import { Element } from '../models/Element.js';

export const listElements = (pageId) =>
    Element.findAll({ where: { pageId }, order: [['z_index', 'ASC'], ['order', 'ASC']] });

export const createElement = (page, data) =>
    Element.create({
        pageId: page.id,
        parentId: data.parentId || null,
        type: data.type,
        x: data.x ?? 0,
        y: data.y ?? 0,
        width: data.width ?? 100,
        height: data.height ?? 30,
        rotation: data.rotation ?? 0,
        zIndex: data.zIndex ?? 0,
        styles: data.styles || {},
        attrs: data.attrs || {},
        order: data.order ?? 0
    });

export const getElement = async (page, elementId) => {
    const el = await Element.findOne({ where: { id: elementId, pageId: page.id } });
    if (!el) throw new Error('Element not found');
    return el;
};

export const updateElement = async (page, elementId, patch) => {
    const el = await getElement(page, elementId);
    await el.update(patch);
    return el;
};

export const removeElement = async (page, elementId) => {
    const el = await getElement(page, elementId);
    await el.destroy();
    return true;
};