import { z } from "zod";

export const envValidator = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  PORT: z.coerce.number().optional().default(4800),
});
