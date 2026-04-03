import prisma from '../lib/prisma.js';

const VALID_DIET_TYPES = ['veg', 'non-veg', 'vegan'];

const validatePreferences = ({ budget, allergies, dietType, caloriesTarget }) => {
    const errors = [];

    if (budget === undefined || budget === null) {
        errors.push('budget is required.');
    } else if (typeof budget !== 'number' || budget <= 0 || budget >= 10000) {
        errors.push('budget must be a number greater than 0 and less than 10000.');
    }

    if (!Array.isArray(allergies)) {
        errors.push('allergies must be an array of strings.');
    } else if (allergies.length > 10) {
        errors.push('allergies must have at most 10 items.');
    } else if (allergies.some(a => typeof a !== 'string')) {
        errors.push('Each allergy must be a string.');
    }

    if (!dietType || !VALID_DIET_TYPES.includes(dietType)) {
        errors.push(`dietType must be one of: ${VALID_DIET_TYPES.join(', ')}.`);
    }

    if (caloriesTarget !== undefined && caloriesTarget !== null) {
        if (typeof caloriesTarget !== 'number' || caloriesTarget < 1000 || caloriesTarget > 5000) {
            errors.push('caloriesTarget must be between 1000 and 5000.');
        }
    }

    return errors;
};

// POST /api/preferences  — create or update preferences for the logged-in user
export const upsertPreferences = async (req, res) => {
    const userId = req.user.id;
    let { budget, allergies, dietType, caloriesTarget } = req.body;

    // Coerce numeric fields that may arrive as strings from FormData
    if (budget !== undefined) budget = Number(budget);
    if (caloriesTarget !== undefined && caloriesTarget !== null && caloriesTarget !== '') {
        caloriesTarget = Number(caloriesTarget);
    } else {
        caloriesTarget = null;
    }
    if (!Array.isArray(allergies)) allergies = [];

    const errors = validatePreferences({ budget, allergies, dietType, caloriesTarget });
    if (errors.length) {
        return res.status(400).json({ error: errors.join(' ') });
    }

    try {
        const preferences = await prisma.userPreference.upsert({
            where: { userId },
            update: { budget, allergies, dietType, caloriesTarget },
            create: { userId, budget, allergies, dietType, caloriesTarget },
        });
        res.json({ message: 'Preferences saved.', preferences });
    } catch (err) {
        console.error('Preferences upsert error:', err);
        res.status(500).json({ error: 'Server error saving preferences.' });
    }
};

// GET /api/preferences  — fetch preferences for the logged-in user
export const getPreferences = async (req, res) => {
    const userId = req.user.id;
    try {
        const preferences = await prisma.userPreference.findUnique({ where: { userId } });
        if (!preferences) {
            return res.status(404).json({ error: 'No preferences found.' });
        }
        res.json({ preferences });
    } catch (err) {
        console.error('Get preferences error:', err);
        res.status(500).json({ error: 'Server error fetching preferences.' });
    }
};
