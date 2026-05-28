import 'dotenv/config'; // Guarantee env variables are loaded under all environments (Next.js, tsx scripts, etc.)
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy initializer to completely bypass compile-time page data checks during next build
export const getDb = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    const connectionUrl = process.env.DATABASE_URL || "file:./dev.db";
    
    // In Prisma 7, PrismaLibSql takes the configuration options directly instead of a created client
    const adapter = new PrismaLibSql({
      url: connectionUrl,
    });

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
};

// Export db getter proxy for backward compatibility
export const db = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    const database = getDb();
    const value = (database as unknown as Record<PropertyKey, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(database);
    }
    return value;
  },
});
