import { User } from "@/types/user";

export interface HttpResponse<T = any> {
  statusCode: number;
  data: T;
}

export interface HttpContextContract {
  request: {
    allParams<T = any>(): T;
    headers(): Record<string, string>;
    queryParam(): Record<string, string>;
    body<T = any>(): T;
    params(): Record<string, string>;
    auth: {
      user?: User;
    };
  };
  response: {
    ok<T = any>(data: T): HttpResponse;
    badRequest(data: any): HttpResponse;
    noContent(data: any): HttpResponse;
    internalServerError(): HttpResponse;
    notFound(data?: any): HttpResponse;
    created(): HttpResponse;
    sendFile(filePath: string, fileName?: string): void;
  };
}
