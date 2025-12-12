import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signJWT = (user) =>
    jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });