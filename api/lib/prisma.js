import { PrismaClient } from '@prisma/client';

// Re-use a single PrismaClient instance across hot reloads in development
const prisma = new PrismaClient();

export default prisma;
