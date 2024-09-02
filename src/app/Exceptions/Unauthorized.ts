import { HttpException } from "@/app/Exceptions/HttpException";
import { EXCEPTION_CODES } from "@/types/exception-codes";

export class UnauthorizedException extends HttpException {
  constructor() {
    super("Unauthorized", 401, EXCEPTION_CODES.UNAUTHORIZED);
    this.name = "UnauthorizedException";
  }
}
