/**
 * Singleton Prisma client instance.
 * Prevents multiple instances in development (hot reload).
 * Prisma 7 requires a driver adapter (e.g. @prisma/adapter-mariadb) when using the client engine.
 */
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionUrl = process.env.DATABASE_URL;
if (!connectionUrl) throw new Error("DATABASE_URL is not set");

// Parse DATABASE_URL (mysql://user:pass@host:port/db) into PoolConfig for mariadb adapter
const url = new URL(connectionUrl.replace(/^mysql:\/\//, "https://"));
const poolConfig = {
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: url.username || undefined,
  password: url.password || undefined,
  database: url.pathname ? url.pathname.slice(1) : undefined,
};
const adapter = new PrismaMariaDb(poolConfig);
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
