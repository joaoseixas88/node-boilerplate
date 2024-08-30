import { ValidationException } from "@/app/Exceptions";
import { Schema } from "zod";

export class SchemaValidator {
  static validateSchema<T = any>(
    schema: Schema<T>,
    params: any,
    statusCode?: number
  ) {
    try {
      return schema.parse(params);
    } catch (error: any) {
      throw new ValidationException(error.issues, statusCode);
    }
  }
}
