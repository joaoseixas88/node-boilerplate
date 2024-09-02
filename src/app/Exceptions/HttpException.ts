import { EXCEPTION_CODES } from "@/types/exception-codes";

export class HttpException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.code = code;
    this.name = "HttpException";
  }
}
