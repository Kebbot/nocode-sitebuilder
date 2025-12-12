import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signJWT } from '../utils/jwt.js';

export const register = async ({ email, password, name }) => {
    const exists = await User.findOne({ where: { email } });
    if (exists) throw new Error('Email already registered');
    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash, name: name || null });
    const token = signJWT(user);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');
    const token = signJWT(user);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
};