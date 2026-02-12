import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color");

export const createSeasonSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    colorHex: z.string().min(1).pipe(hexColor),
    iconName: z.string().min(1).max(50),
    duration: z.string().min(1).max(100),
    sortOrder: z.number().int().min(0),
  }),
});

export const updateSeasonSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    colorHex: z.string().pipe(hexColor).optional(),
    iconName: z.string().min(1).max(50).optional(),
    duration: z.string().min(1).max(100).optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
});

export const getSeasonParamsSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
});

export type CreateSeasonBody = z.infer<typeof createSeasonSchema>["body"];
export type UpdateSeasonBody = z.infer<typeof updateSeasonSchema>["body"];
