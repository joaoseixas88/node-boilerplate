import { Schema, z } from "zod";

export abstract class BaseValidator {
  [key: string]: () => z.ZodTypeAny;
}
