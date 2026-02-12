/**
 * Zod schemas for occasions API validation.
 */
import { z } from "zod";

const hijriMonth = z.number().int().min(1).max(12);
const hijriDay = z.number().int().min(1).max(30);

export const createOccasionSchema = z.object({
  body: z.object({
    hijriMonth: hijriMonth,
    hijriDay: hijriDay,
    title: z.string().min(1).max(500),
    prayerTitle: z.string().min(1).max(500),
    prayerText: z.string().max(5000).optional().nullable(),
  }),
});

export const updateOccasionSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
  body: z.object({
    hijriMonth: hijriMonth.optional(),
    hijriDay: hijriDay.optional(),
    title: z.string().min(1).max(500).optional(),
    prayerTitle: z.string().min(1).max(500).optional(),
    prayerText: z.string().max(5000).optional().nullable(),
  }),
});

export const getOccasionParamsSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
});

export const listOccasionsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform((s) => (s ? Number(s) : undefined)),
    limit: z.string().regex(/^\d+$/).optional().transform((s) => (s ? Number(s) : undefined)),
  }),
});

export type CreateOccasionBody = z.infer<typeof createOccasionSchema>["body"];
export type UpdateOccasionBody = z.infer<typeof updateOccasionSchema>["body"];
