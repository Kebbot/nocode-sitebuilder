import path from 'path';
import { Asset } from '../models/Asset.js';
import { env } from '../config/env.js';

export const saveAsset = async ({ file, userId, projectId }) => {
    const url = `/uploads/${path.basename(file.path)}`;
    const asset = await Asset.create({
        userId,
        projectId: projectId || null,
        filename: file.originalname,
        mime: file.mimetype,
        size: file.size,
        url
    });
    return asset;
};

export const listAssets = (userId, projectId) =>
    Asset.findAll({
        where: projectId ? { userId, projectId } : { userId },
        order: [['created_at', 'DESC']]
    });

export const deleteAsset = async (userId, id) => {
    const asset = await Asset.findOne({ where: { id, userId } });
    if (!asset) throw new Error('Asset not found');
    await asset.destroy();
    return true;
};