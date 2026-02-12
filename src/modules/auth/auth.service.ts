/**
 * Auth service: login and JWT handling.
 */
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-in-production";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];
const SALT_ROUNDS = 10;

export interface LoginResult {
  token: string;
  admin: { id: number; email: string; name: string | null };
}

/** Validate credentials and return JWT and admin info. */
export async function login(email: string, password: string): Promise<LoginResult | null> {
  const admin = await prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!admin) return null;
  const valid = await bcrypt.compare(password.trim(), admin.passwordHash);
  if (!valid) return null;
  const token = jwt.sign(
    { sub: String(admin.id), email: admin.email },
    JWT_SECRET as jwt.Secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return {
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name },
  };
}

/** Verify JWT and return payload (throws if invalid). */
export function verifyToken(token: string): { sub: string; email: string } {
  const payload = jwt.verify(token, JWT_SECRET) as { sub?: string; email?: string };
  if (!payload?.sub) throw new Error("Invalid token");
  return { sub: payload.sub, email: payload.email ?? "" };
}

/** Hash password for storing (e.g. seed). */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
