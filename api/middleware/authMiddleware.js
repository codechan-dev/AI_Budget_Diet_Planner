import { verifyToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.warn('Auth middleware rejected token:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

export default authMiddleware;
