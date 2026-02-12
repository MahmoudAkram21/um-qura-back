/**
 * Zod schemas for stars API validation.
 */
import { z } from "zod";

const jsonArrayOfStrings = z
  .array(z.string())
  .optional()
  .default([]);

export const createStarSchema = z.object({
  body: z.object({
    seasonId: z.number().int().positive(),
    name: z.string().min(1).max(255),
    startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    description: z.string().max(2000).optional().nullable(),
    weatherInfo: z.string().max(5000).optional().nullable(),
    agriculturalInfo: jsonArrayOfStrings,
    tips: jsonArrayOfStrings,
  }),
});

export const updateStarSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    description: z.string().max(2000).optional().nullable(),
    weatherInfo: z.string().max(5000).optional().nullable(),
    agriculturalInfo: jsonArrayOfStrings.optional(),
    tips: jsonArrayOfStrings.optional(),
  }),
});

export const getStarParamsSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
});

export const listStarsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform((s) => (s ? Number(s) : undefined)),
    limit: z.string().regex(/^\d+$/).optional().transform((s) => (s ? Number(s) : undefined)),
    seasonId: z.string().regex(/^\d+$/).optional().transform((s) => (s ? Number(s) : undefined)),
  }),
});

export type CreateStarBody = z.infer<typeof createStarSchema>["body"];
export type UpdateStarBody = z.infer<typeof updateStarSchema>["body"];
