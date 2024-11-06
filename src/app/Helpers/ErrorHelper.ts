import { HttpException, ValidationException } from '@/app/Exceptions';

export class ErrorHelper {
  static sendToLogger(error: any) {
    if (error instanceof HttpException) return;
    if (error instanceof ValidationException) return;
    console.error(error);
  }
}
