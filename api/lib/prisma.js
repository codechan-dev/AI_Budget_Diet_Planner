import { PrismaClient } from '@prisma/client';

// Re-use a single PrismaClient instance; in dev, persist across hot reloads
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
