/**
 * Validation middleware: runs Zod schema and attaches result to req.validated.
 */
import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

export function validate<T extends z.ZodType>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      (req as Request & { validated: z.infer<T> }).validated = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
}
