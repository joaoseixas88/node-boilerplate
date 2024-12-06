import { z } from "zod";

export const envValidator = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number()
});
