import * as svc from '../services/asset.service.js';

export const uploadOne = async (req, res, next) => {
    try {
        if (!req.file) throw new Error('No file');
        const asset = await svc.saveAsset({
            file: req.file,
            userId: req.user.id,
            projectId: req.body.projectId || null
        });
        res.status(201).json(asset);
    } catch (e) { next(e); }
};

export const list = async (req, res, next) => {
    try {
        const rows = await svc.listAssets(req.user.id, req.query.projectId || null);
        res.json(rows);
    } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
    try {
        await svc.deleteAsset(req.user.id, req.params.assetId);
        res.status(204).send();
    } catch (e) { next(e); }
};