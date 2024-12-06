import { HttpException } from '@/app/Exceptions/HttpException';

export class BadRequestException extends HttpException {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}
