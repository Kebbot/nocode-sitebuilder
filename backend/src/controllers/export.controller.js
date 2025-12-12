// backend/src/controllers/export.controller.js
import { exportProjectZip } from '../services/export.service.js';

export async function exportProject(req, res, next) {
    try {
        const userId = req.userId;
        const { projectId } = req.params;
        await exportProjectZip(userId, projectId, res);
    } catch (err) {
        next(err);
    }
}

export default { exportProject };
