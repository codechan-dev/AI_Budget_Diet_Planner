import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { signToken } from '../utils/jwt.js';

// Linear email check — no regex backtracking possible
const isValidEmail = (email) => {
    const at = email.indexOf('@');
    const dot = email.lastIndexOf('.');
    return (
        at > 0 &&
        dot > at + 1 &&
        dot < email.length - 1 &&
        !email.includes(' ')
    );
};

// POST /api/auth/register
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    try {
        const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (exists) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashed,
            },
        });

        const token = signToken({ id: user.id, email: user.email });
        res.status(201).json({
            message: 'Registration successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error during registration.' });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = signToken({ id: user.id, email: user.email });
        res.json({
            message: 'Login successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ user });
    } catch (err) {
        console.error('GetMe error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};
