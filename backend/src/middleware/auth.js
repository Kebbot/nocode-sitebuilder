// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Проверка JWT из заголовка Authorization: Bearer <token>
export function requireAuth(req, res, next) {
    try {
        const header = req.headers['authorization'] || '';
        const [scheme, token] = header.split(' ');

        if (!token || scheme !== 'Bearer') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

export default requireAuth;
