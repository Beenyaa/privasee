import type { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

type ValidateSchema = {
  params?: AnyZodObject;
  query?: AnyZodObject;
  body?: AnyZodObject;
};

export const validateRequest =
  (schema: ValidateSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        await schema.params.parseAsync(req.params);
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
