import { EXCEPTION_CODES } from '@/types/exception-codes';

export class HttpException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
    this.code = code ? code : EXCEPTION_CODES.HTTP_EXCEPTION;
    this.name = 'HttpException';
  }
}
