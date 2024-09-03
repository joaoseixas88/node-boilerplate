import { SignedUser } from "@/types/user";

export interface HttpResponse<T = any> {
  statusCode: number;
  data?: T;
}

export interface HttpContextContract {
  request: {
    allParams<T = any>(): T;
    headers(): Record<string, string | string[] | undefined>;
    queryParams<T = any>(): T | Record<string, string | undefined>;
    body<T = any>(): T;
    params<T = any>(): T | Record<string, string>;
    auth: {
      user?: SignedUser;
    };
  };
  response: {
    ok<T = any>(data: T): HttpResponse;
    badRequest(error: Error | string): HttpResponse;
    noContent(data: any): HttpResponse;
    internalServerError(err?: Error | string): HttpResponse;
    notFound(data?: any): HttpResponse;
    created(): HttpResponse;
    sendFile(filePath: string, fileName?: string): void;
    unprocessableEntity(): HttpResponse;
  };
}
