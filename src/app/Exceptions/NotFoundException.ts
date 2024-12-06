import { HttpException } from '@/app/Exceptions/HttpException';
import { EXCEPTION_CODES } from '@/types/exception-codes';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, 404, EXCEPTION_CODES.NOT_FOUND);
		this.name = 'NotFoundException'
  }
}
