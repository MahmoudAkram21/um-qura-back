/**
 * Zod schemas for prayers API validation.
 */
import { z } from "zod";

export const createPrayerSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(10000),
  }),
});

export const updatePrayerSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
  body: z.object({
    text: z.string().min(1).max(10000).optional(),
  }),
});

export const getPrayerParamsSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
});

export const listPrayersQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform((s) => (s ? Number(s) : undefined)),
    limit: z.string().regex(/^\d+$/).optional().transform((s) => (s ? Number(s) : undefined)),
  }),
});

export type CreatePrayerBody = z.infer<typeof createPrayerSchema>["body"];
export type UpdatePrayerBody = z.infer<typeof updatePrayerSchema>["body"];
