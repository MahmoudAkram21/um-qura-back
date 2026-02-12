/**
 * Prayers service: random (public) and admin CRUD.
 */
import { prisma } from "../../prisma/client.js";

/** Get a single prayer at random. Returns null if no prayers exist. */
export async function getRandomPrayer(): Promise<{ id: number; text: string } | null> {
  const prayers = await prisma.prayer.findMany({
    select: { id: true, text: true },
  });
  if (prayers.length === 0) return null;
  const index = Math.floor(Math.random() * prayers.length);
  const p = prayers[index];
  return { id: p.id, text: p.text };
}

/** Admin: list prayers with pagination. */
export async function listPrayers(params?: { page?: number; limit?: number }): Promise<{
  data: { id: number; text: string; created_at: Date; updated_at: Date }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(100, Math.max(1, params?.limit ?? 20));
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.prayer.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.prayer.count(),
  ]);
  const totalPages = Math.ceil(total / limit);
  const data = items.map((p) => ({
    id: p.id,
    text: p.text,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }));
  return { data, total, page, limit, totalPages };
}

/** Admin: get one prayer by id. */
export async function getPrayerById(id: number): Promise<{ id: number; text: string; created_at: Date; updated_at: Date } | null> {
  const p = await prisma.prayer.findUnique({ where: { id } });
  if (!p) return null;
  return { id: p.id, text: p.text, created_at: p.createdAt, updated_at: p.updatedAt };
}

/** Admin: create prayer. */
export async function createPrayer(text: string): Promise<{ id: number; text: string; created_at: Date; updated_at: Date }> {
  const p = await prisma.prayer.create({ data: { text } });
  return { id: p.id, text: p.text, created_at: p.createdAt, updated_at: p.updatedAt };
}

/** Admin: update prayer. */
export async function updatePrayer(id: number, text: string): Promise<{ id: number; text: string; created_at: Date; updated_at: Date } | null> {
  const p = await prisma.prayer.update({ where: { id }, data: { text } }).catch(() => null);
  if (!p) return null;
  return { id: p.id, text: p.text, created_at: p.createdAt, updated_at: p.updatedAt };
}

/** Admin: delete prayer. */
export async function deletePrayer(id: number): Promise<boolean> {
  const result = await prisma.prayer.deleteMany({ where: { id } });
  return result.count > 0;
}
