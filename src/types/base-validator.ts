import { ValidationException } from "@/app/Exceptions";
import { Schema, z } from "zod";

interface ValidationType<T> {
  [key: string]:
    | (() => z.ZodTypeAny)
    | ((schema: Schema<T>, params: any, statusCode?: number) => T);
}
export abstract class BaseValidator {
  static validate<T>(schema: Schema<T>, params: any, statusCode?: number) {
    try {
      return schema.parse(params);
    } catch (error: any) {
      throw new ValidationException(error.issues, statusCode);
    }
  }
}
