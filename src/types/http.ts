import { MultipartFile } from '@/types/multipart-file';
import { AuthenticatedUser } from '@/types/user';

export interface HttpResponse<T = any> {
  statusCode: number;
  status?: number;
  data?: T;
  responseContext?: {
    deleteFile?: string;
  };
}

export interface HttpContextContract {
  request: {
    files(): MultipartFile[];
    file(
      key: string,
      options?: { shouldDelete: boolean },
    ): MultipartFile | undefined;
    allParams<T = any>(): T;
    headers(): Record<string, string | string[] | undefined>;
    queryParams<T = any>(): T | Record<string, string | undefined>;
    body<T = any>(): T;
    params<T = any>(): T | Record<string, string>;
    auth: {
      user?: AuthenticatedUser;
    };
  };
  response: {
    ok<T = any>(data?: T): HttpResponse;
    badRequest(error: Error | string): HttpResponse;
    noContent(): HttpResponse;
    internalServerError(err?: Error | string): HttpResponse;
    unauthorized(): HttpResponse;
    notFound(data?: any): HttpResponse;
    created(): HttpResponse;
    sendFile(filePath: string, fileName?: string): void;
    unprocessableEntity(error?: any): HttpResponse;
  };
}
