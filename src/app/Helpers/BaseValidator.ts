import { ValidationException } from '@/app/Exceptions';
import { z, Schema } from 'zod';

export class BaseValidator {
  static validate<T>(schema: Schema<T>, params: any, statusCode?: number) {
    try {
      return schema.parse(params);
    } catch (error: any) {
      throw new ValidationException(error.issues, statusCode);
    }
  }
}

