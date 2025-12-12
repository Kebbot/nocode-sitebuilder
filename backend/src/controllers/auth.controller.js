// backend/src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const TOKEN_EXPIRES_IN = '7d';

function signToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRES_IN }
    );
}

export async function register(req, res, next) {
    try {
        const { email, password, name } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            name: name ?? null
        });

        const token = signToken(user);

        return res.status(201).json({
            user: { id: user.id, email: user.email, name: user.name },
            token
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken(user);

        return res.json({
            user: { id: user.id, email: user.email, name: user.name },
            token
        });
    } catch (err) {
        next(err);
    }
}

export async function me(req, res, next) {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        return res.json({
            id: user.id,
            email: user.email,
            name: user.name
        });
    } catch (err) {
        next(err);
    }
}

export default { register, login, me };
