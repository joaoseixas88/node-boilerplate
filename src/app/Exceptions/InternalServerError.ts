import { HttpException } from '@/app/Exceptions/HttpException';
import { EXCEPTION_CODES } from '@/types/exception-codes';

export class InternalServerError extends HttpException {
  constructor() {
    super('Internal Server Error', 500, EXCEPTION_CODES.INTERNAL_SERVER_ERROR);
		this.name = 'InternalServerError'
  }
}
