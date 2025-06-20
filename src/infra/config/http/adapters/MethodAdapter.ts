import { HttpException, ValidationException } from "@/app/Exceptions";
import { ErrorHelper } from "@/Helpers/ErrorHelper";
import { HttpContextRequest, HttpContextResponse } from "@/types";
import { EXCEPTION_CODES } from "@/types/exception-codes";
import { MultipartFile } from "@/types/multipart-file";
import { NextFunction, Request, Response } from "express";
import { unlink } from "fs/promises";
import { container } from "tsyringe";

class HttpContextRequestImpl implements HttpContextRequest {
  public filesToDelete: { filepath: string }[] = [];
  constructor(
    public req: Request,
    public res: Response,
    public next: NextFunction
  ) {}
  allParams<T = any>(): T {
    const allParams = {
      ...(this.req.body ?? {}),
      ...(this.req.query ?? {}),
      ...(this.req.params ?? {}),
    };
    return allParams;
  }
  body<T = any>(): T {
    return this.req.body;
  }
  params<T = any>(): T | Record<string, string> {
    return this.req.params;
  }
  queryParams<T = any>(): T | Record<string, string | undefined> {
    return this.req.query as T | Record<string, string | undefined>;
  }
  headers<T>(): Record<string, string | string[] | undefined> {
    return this.req.headers;
  }
  get auth() {
    return {
      user: this.req.user,
    };
  }
  file(
    key: string,
    options?: { shouldDelete: boolean }
  ): MultipartFile | undefined {
    const file = (this.req.files as Express.Multer.File[]).find(
      (file) => file.fieldname === key
    );
    if (options?.shouldDelete) {
      if (file) {
        this.filesToDelete.push({ filepath: file.path });
      }
    }

    return file;
  }
  files(): MultipartFile[] {
    const files =
      (this.req.files as Express.Multer.File[]) ??
      ([] as Express.Multer.File[]);
    return files;
  }
}

const errorHttpResponse = (
  error: Error | string,
  statusCode?: number
): HttpResponse => {
  if (error instanceof HttpException) {
    return new HttpResponse(error.statusCode, error);
  }
  if (error instanceof ValidationException) {
    return new HttpResponse(error.statusCode, {
      message: "Validation error",
      issues: error.issues,
      code: EXCEPTION_CODES.VALIDATION,
    });
  }

  return new HttpResponse(statusCode ?? 400, error);
};

class HttpResponse {
  public file: {
    path: string;
    options?: {
      headers?: Record<string, unknown>;
    };
  } | null = null;
  constructor(
    public statusCode: number,
    public data?: any,
    public status?: number
  ) {}
  parse() {
    return {
      statusCode: this.statusCode,
      status: this.status,
      data: this.data,
    };
  }
}

class HttpContextResponseImpl implements HttpContextResponse {
  constructor(
    public req: Request,
    public res: Response,
    public next: NextFunction
  ) {}
  ok<T = any>(data?: T): HttpResponse {
    return new HttpResponse(200, data);
  }
  badRequest(error: Error | string): HttpResponse {
    return errorHttpResponse(error);
  }
  noContent(): HttpResponse {
    return new HttpResponse(204);
  }
  internalServerError(err?: Error | string): HttpResponse {
    return new HttpResponse(500, "Internal server error");
  }
  unauthorized(): HttpResponse {
    return new HttpResponse(401, "Unauthorized");
  }
  notFound(data?: any): HttpResponse {
    return new HttpResponse(404, data ? `${data} not found` : "Not found");
  }
  created(data?: any): HttpResponse {
    return new HttpResponse(201, data);
  }
  sendFile(filePath: string, fileName?: string): HttpResponse {
    const response = new HttpResponse(200);
    const options = fileName
      ? {
          headers: {
            "Content-Disposition": `attachment; filename=${fileName}`,
          },
        }
      : {};
    response.file = { path: filePath, options };
    return response;
  }
  unprocessableEntity(error?: any): HttpResponse {
    if (
      error instanceof ValidationException ||
      error instanceof HttpException
    ) {
      return errorHttpResponse(error);
    }
    return new HttpResponse(422, error);
  }
}

export const methodAdapterToExpress = <T>(
  controller: new (...args: any[]) => T,
  method: keyof T
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const instance = container.resolve(controller);
    const requestContext = new HttpContextRequestImpl(req, res, next);
    const responseContext = new HttpContextResponseImpl(req, res, next);
    const ctx = {
      request: requestContext,
      response: responseContext,
    };

    if (typeof instance[method] === "function") {
      const httpResponse = await instance[method](ctx);
      if (httpResponse instanceof HttpResponse) {
        if (requestContext.filesToDelete.length) {
          for (const fileToDelete of requestContext.filesToDelete) {
            unlink(fileToDelete.filepath).catch((e: any) => {
              if (e.code !== "ENOENT") {
                console.log(e);
              }
            });
          }
        }
        if (httpResponse.file) {
          return res.sendFile(
            httpResponse.file.path,
            httpResponse.file.options ?? {},
            (err: any) => {
              if (err) {
                ErrorHelper.sendToLogger(err);
                res.status(500).send("Internal server error");
              }
            }
          );
        }
        return res
          .status(httpResponse.statusCode ?? 200)
          .json(httpResponse.data);
      }
      if (httpResponse?.status) {
        const { status, ...rest } = httpResponse;
        return res.status(httpResponse.status).json(rest);
      }
      if (httpResponse?.statusCode) {
        const { statusCode, ...rest } = httpResponse;
        return res.status(httpResponse.statusCode).json(rest);
      }
      if (!res.headersSent) {
        return res.status(200).json(httpResponse);
      }
    }
  } catch (error) {
    ErrorHelper.sendToLogger(error);
    if (error instanceof HttpException) {
      return res.status(error.statusCode).json(
        error.message
          ? {
              ...error,
              message: error.message,
            }
          : error
      );
    }
    if (error instanceof ValidationException) {
      return res.status(error.statusCode).json({
        message: "Validation error",
        issues: error.issues,
      });
    }
    return res.status(500).send("Internal server error");
  }
};
